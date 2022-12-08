// import { EllipseNode, EllipseNodeModel } from '@logicflow/core';
import { EllipseResize } from '@logicflow/extension';
// import { h } from '@logicflow/core';
class InputModel extends EllipseResize.model {
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

class InputView extends EllipseResize.view {}

export default {
  type: 'input',
  view: InputView,
  model: InputModel,
};
