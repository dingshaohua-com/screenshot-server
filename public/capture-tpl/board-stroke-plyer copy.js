/**
 * Canvas 宽度设置演示
 * 模拟 BoardCanvas 组件的坐标转换逻辑
 */

class BoardStrokePlyer {
  constructor(canvasSelector, containerSelector, contentSelector) {
    this.canvas = document.querySelector(canvasSelector);
    this.container = document.querySelector(containerSelector);
    this.contentArea = document.querySelector(contentSelector);
    this.ctx = this.canvas?.getContext("2d");

    if (!this.canvas || !this.container || !this.contentArea) {
      console.error("Canvas Demo: 必需的 DOM 元素未找到");
      return;
    }

    this.init();
  }

  // 获取内容区域的逻辑尺寸
  getContentLogicalSize() {
    if (!this.contentArea) {
      return { width: 0, height: 0 };
    }

    return {
      width: this.contentArea.scrollWidth || this.contentArea.clientWidth,
      height: this.contentArea.scrollHeight || this.contentArea.clientHeight,
    };
  }

  // 获取内容区域相对于容器的位置
  getContentPosition() {
    if (!this.contentArea || !this.container) {
      return { x: 0, y: 0 };
    }

    const containerRect = this.container.getBoundingClientRect();
    const contentRect = this.contentArea.getBoundingClientRect();

    return {
      x: contentRect.left - containerRect.left,
      y: contentRect.top - containerRect.top + this.container.scrollTop,
    };
  }

  // 将逻辑坐标转换为绝对坐标
  relativeToAbsolute(point, logicalSize, contentPos) {
    if (!point || !logicalSize.width || !logicalSize.height) {
      return null;
    }

    // 逻辑坐标 → 相对坐标
    const relativeX = point.x * logicalSize.width;
    const relativeY = point.y * logicalSize.height;

    // 相对坐标 → 绝对坐标
    return {
      x: relativeX + contentPos.x,
      y: relativeY + contentPos.y,
    };
  }

  // 更新 Canvas 尺寸
  updateCanvasSize() {
    if (!this.canvas || !this.container) return;

    const rect = this.container.getBoundingClientRect();

    // Canvas 宽度 = 容器的实际渲染宽度
    this.canvas.width = rect.width;
    // Canvas 高度 = 容器的完整内容高度
    this.canvas.height = this.container.scrollHeight;

    // 重新绘制
    this.redraw();
  }

  // 绘制笔迹
  draw(strokes) {
    if (!this.ctx || !strokes) return;

    const logicalSize = this.getContentLogicalSize();
    const contentPos = this.getContentPosition();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    strokes.forEach((stroke) => {
      if (!stroke?.points?.length) return;

      this.ctx.save();
      this.ctx.strokeStyle = stroke.style?.color ?? "#000";
      this.ctx.lineWidth = stroke.style?.width ?? 2;
      this.ctx.globalAlpha = stroke.style?.opacity ?? 1;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";

      this.ctx.beginPath();
      const pts = stroke.points;

      let p0 = this.relativeToAbsolute(pts[0], logicalSize, contentPos);
      if (!p0) return;
      this.ctx.moveTo(p0.x, p0.y);

      for (let i = 1; i < pts.length; i++) {
        const p1 = this.relativeToAbsolute(pts[i], logicalSize, contentPos);
        if (!p1) continue;

        const midX = (p0.x + p1.x) / 2;
        const midY = (p0.y + p1.y) / 2;
        this.ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
        p0 = p1;
      }

      this.ctx.stroke();
      this.ctx.restore();
    });
  }

  // 重新绘制（使用当前保存的笔迹）
  redraw() {
    if (this.currentStrokes) {
      this.draw(this.currentStrokes);
    }
  }

  // 初始化
  init() {
    // 初始化尺寸
    this.updateCanvasSize();

    // 监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      this.updateCanvasSize();
    });
    resizeObserver.observe(this.container);

    // 监听窗口大小变化
    window.addEventListener("resize", () => {
      this.updateCanvasSize();
    });
  }

  // 设置笔迹并绘制
  setStrokes(strokes) {
    this.currentStrokes = strokes;
    this.draw(strokes);
  }

  // 获取调试信息
  getDebugInfo() {
    const rect = this.container.getBoundingClientRect();
    const logicalSize = this.getContentLogicalSize();
    const contentPos = this.getContentPosition();

    return {
      canvas: {
        width: this.canvas.width,
        height: this.canvas.height,
      },
      container: {
        width: rect.width,
        height: this.container.scrollHeight,
      },
      content: {
        width: logicalSize.width,
        height: logicalSize.height,
      },
      contentOffset: {
        x: contentPos.x,
        y: contentPos.y,
      },
    };
  }

}

  // 初始化 Canvas 演示
  const plyer = new BoardStrokePlyer(
    "canvas",
    ".lecture-layout-container",
    ".lecture-content-wrapper"
  );

  // 设置笔迹数据
  plyer.setStrokes(window.strokes);