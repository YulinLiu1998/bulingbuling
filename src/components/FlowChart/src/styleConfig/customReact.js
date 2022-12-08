// import { EllipseNode, EllipseNodeModel } from '@logicflow/core';
import { RectResize } from '@logicflow/extension';
// import { h } from '@logicflow/core';
class ReactModel extends RectResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 240;
    this.height = 60;
    this.radius = 20;
    this.text.draggable = false;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 20;
    style.color = 'black';
    return style;
  }
}

class ReactView extends RectResize.view {}

export default {
  type: 'custom-react',
  view: ReactView,
  model: ReactModel,
};
