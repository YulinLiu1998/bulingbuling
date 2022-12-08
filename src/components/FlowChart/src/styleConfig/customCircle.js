import { h } from '@logicflow/core';
import { EllipseResize } from '@logicflow/extension';
class CustomCircle extends EllipseResize.view {
  // 从iconfont下载的svg
  getIcon() {
    const { x, y, width, height } = this.props.model;
    const style = this.props.model.getNodeStyle();
    return h(
      'svg',
      {
        // model中x,y表示中心坐标，而svg x,y表示左上角
        x: x - width,
        y: y - height / 2,
        viewBox: '0 0 1024 1024',
        width: 50,
        height: 50,
      },
      [
        h('path', {
          d: 'M512 81.184916c173.303044 0 314.271695 140.968651 314.271695 314.271695 0 76.299864-50.478873 198.658791-131.66379 319.156747-80.25443 119.102226-153.995457 183.30577-182.375283 196.332576-28.379827-13.492049-102.120854-78.160836-182.607906-197.263063C248.4398 592.952294 197.728305 471.05861 197.728305 395.456611 197.728305 222.153567 338.696956 81.184916 512 81.184916M512 0C293.801 0 116.543389 177.024989 116.543389 395.456611s289.148569 598.535211 395.456611 598.535211c109.0995 0 395.456611-380.103589 395.456611-598.535211S730.431622 0 512 0z',
          fill: style.stroke,
        }),
        h('path', {
          d: 'M512 331.253067a93.513857 93.513857 0 1 1 0 187.027714 93.513857 93.513857 0 0 1 0-187.027714m0-81.184916c-96.537937 0-174.698773 78.160836-174.698773 174.698773s78.160836 174.698773 174.698773 174.698773 174.698773-78.160836 174.698773-174.698773-78.160836-174.698773-174.698773-174.698773zM643.431168 1024h-262.862336c-19.307587 0-34.89323-15.585643-34.89323-34.89323s15.585643-34.89323 34.89323-34.893231h262.862336c19.307587 0 34.89323 15.585643 34.89323 34.893231s-15.585643 34.89323-34.89323 34.89323z',
          fill: style.stroke,
        }),
      ],
    );
  }
  getResizeShape() {
    const { x, y, rx, ry } = this.props.model;
    const style = this.props.model.getNodeStyle();
    return h('g', {}, [
      h('ellipse', {
        ...style,
        cx: x,
        cy: y,
        rx,
        ry,
      }),
      this.getIcon(),
    ]);
  }
}

class CustomCircleModel extends EllipseResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.rx = 60;
    this.ry = 40;
  }
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = '#337dfc';
    // style.strokeWidth = 4;
    return style;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 20;
    style.color = 'black';
    return style;
  }
}

export default {
  type: 'customCircle',
  model: CustomCircleModel,
  view: CustomCircle,
};
