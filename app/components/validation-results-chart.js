import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import {
  buildCsv,
  csvFileName,
  percentage,
} from 'frontend-decide-human-validator/utils/validation-results';

echarts.use([
  SVGRenderer,
  BarChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
]);

// border colours of the success and warning AuPill used for the vote counts
const APPROVE_COLOR = '#009e47';
const REJECT_COLOR = '#ffa10a';
const MAX_LABEL_LENGTH = 40;

function truncate(label) {
  return label.length > MAX_LABEL_LENGTH
    ? `${label.slice(0, MAX_LABEL_LENGTH - 3)}...`
    : label;
}

export default class ValidationResultsChart extends Component {
  @service intl;

  chart;

  get total() {
    return this.args.rows.reduce(
      (sum, row) => sum + row.approve + row.reject,
      0,
    );
  }

  get filterSummary() {
    return this.args.filterSummary.join(' · ');
  }

  get chartOptions() {
    const rows = this.args.rows;
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        confine: true,
        extraCssText: 'max-width: 400px; white-space: normal;',
        formatter: (params) => {
          const row = rows[params[0].dataIndex];
          const votes = row.approve + row.reject;
          const approvalRate = votes
            ? `<div>${echarts.format.encodeHTML(
                this.intl.t('validation-results-approval-rate', {
                  pct: percentage(row.approve, votes),
                  approve: row.approve,
                  total: votes,
                }),
              )}</div>`
            : '';
          return `
            <h4 style="margin: 5px 0">${echarts.format.encodeHTML(row.label)}</h4>
            ${params
              .map(
                (param) =>
                  `<div>${param.marker}${echarts.format.encodeHTML(param.seriesName)}: ${param.value}</div>`,
              )
              .join('')}
            ${approvalRate}
          `;
        },
      },
      legend: { top: 0 },
      grid: { top: 30, bottom: 10, left: 10, right: 20 },
      xAxis: { type: 'value', minInterval: 1 },
      yAxis: {
        type: 'category',
        inverse: true,
        data: rows.map((row) => truncate(row.label)),
      },
      series: [
        {
          name: this.intl.t('validation-results-approve'),
          type: 'bar',
          color: APPROVE_COLOR,
          data: rows.map((row) => row.approve),
        },
        {
          name: this.intl.t('validation-results-reject'),
          type: 'bar',
          color: REJECT_COLOR,
          data: rows.map((row) => row.reject),
        },
      ],
    };
  }

  @action
  downloadCsv() {
    const headers = [
      'concept',
      'labeled-decisions',
      'reviewed-decisions',
      'approve-votes',
      'reject-votes',
      'total-votes',
      'approval-rate',
    ].map((key) => this.intl.t(`validation-results-csv-${key}`));
    const blob = new Blob([buildCsv(this.args.rows, headers)], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = csvFileName(this.args.filterSummary);
    link.click();
    setTimeout(() => URL.revokeObjectURL(url));
  }

  renderChart = (element) => {
    this.chart?.dispose();
    this.chart = echarts.init(element, null, { renderer: 'svg' });
    this.chart.setOption(this.chartOptions);
    window.addEventListener('resize', this.resizeHandler);
  };

  updateChart = () => {
    this.chart?.setOption(this.chartOptions, true);
  };

  resizeHandler = () => {
    this.chart?.resize();
  };

  willDestroy() {
    super.willDestroy(...arguments);
    window.removeEventListener('resize', this.resizeHandler);
    this.chart?.dispose();
  }
}
