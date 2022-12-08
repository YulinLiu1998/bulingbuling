import { EllipseResize } from '@logicflow/extension';
class OutputModel extends EllipseResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.rx = 100;
    this.ry = 40;
    this.text.draggable = false;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 20;
    style.color = 'black';
    return style;
  }
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = '#337dfc';
    // style.strokeDasharray = '3 3';
    return style;
  }
}

class OutputView extends EllipseResize.view {}

export default {
  type: 'output',
  view: OutputView,
  model: OutputModel,
};
