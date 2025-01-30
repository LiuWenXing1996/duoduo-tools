export class RegisterDbltouchEvent {
  el: HTMLElement | Window;
  callback: (evt: Event) => void;
  timer: number | null;
  prevPosition: { pageX?: number; pageY?: number };
  isWaiting: boolean;

  constructor(el: HTMLElement | Window, fn: (evt: Event) => void) {
    this.el = el || window;
    this.callback = fn;
    this.timer = null;
    this.prevPosition = {};
    this.isWaiting = false;

    // 注册click事件，注意this指向
    this.el.addEventListener(
      "click",
      (...rest) => {
        this.handleClick(rest[0] as MouseEvent);
      },
      true
    );
  }

  handleClick(evt: MouseEvent): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (!evt.isTrusted) {
      return;
    }
    if (this.isWaiting) {
      this.isWaiting = false;
      const diffX = Math.abs(evt.pageX - (this.prevPosition.pageX || 0));
      const diffY = Math.abs(evt.pageY - (this.prevPosition.pageY || 0));
      // 如果满足位移小于10，则是双击
      if (diffX <= 10 && diffY <= 10) {
        // 取消当前事件传递，并派发1个自定义双击事件
        evt.stopPropagation();
        evt.target?.dispatchEvent(
          new PointerEvent("dbltouch", {
            cancelable: false,
            bubbles: true,
          })
        );
        // 也可以采用回调函数的方式
        this.callback && this.callback(evt);
      }
    } else {
      this.prevPosition = { pageX: evt.pageX, pageY: evt.pageY };
      // 阻止冒泡，不让事件继续传播
      evt.stopPropagation();
      // 开始等待第2次点击
      this.isWaiting = true;
      // 设置200ms倒计时，200ms后重新派发当前事件
      this.timer = window.setTimeout(() => {
        this.isWaiting = false;
        evt.target?.dispatchEvent(evt);
      }, 200);
    }
  }
}
