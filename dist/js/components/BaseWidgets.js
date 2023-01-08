class BaseWidgets {
  constructor(wrapperElement, initialValue){
    const thisBaseWidget = this;

    thisBaseWidget.dom = {};
    thisBaseWidget.dom.wrapper = wrapperElement;

    thisBaseWidget.value = initialValue;
  }
}

export default BaseWidgets;
