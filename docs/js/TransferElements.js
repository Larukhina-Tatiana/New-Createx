class TransferElements {
  constructor(...configs) {
    this.configs = configs.map((config) => {
      const parent = config.sourceElement.parentNode;
      const placeholder = document.createComment("transfer-placeholder");
      parent.insertBefore(placeholder, config.sourceElement);

      return {
        ...config,
        originalParent: parent,
        placeholder,
      };
    });

    this.handleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  handleResize() {
    const currentWidth = window.innerWidth;

    this.configs.forEach((config) => {
      const { sourceElement, breakpoints, originalParent, placeholder } =
        config;

      const activeBreakpoint = Object.keys(breakpoints)
        .sort((a, b) => parseInt(b) - parseInt(a))
        .find((bp) => {
          const cond = breakpoints[bp].condition || "max";
          return cond === "min"
            ? currentWidth >= parseInt(bp)
            : currentWidth <= parseInt(bp);
        });

      if (activeBreakpoint) {
        const { targetElement, targetPosition } = breakpoints[activeBreakpoint];
        if (sourceElement.parentNode !== targetElement) {
          const children = Array.from(targetElement.children);
          targetElement.insertBefore(
            sourceElement,
            children[targetPosition] || null
          );
        }
      } else {
        if (
          placeholder.parentNode === originalParent &&
          sourceElement.parentNode !== originalParent
        ) {
          originalParent.insertBefore(sourceElement, placeholder);
        }
      }
    });
  }

  destroy() {
    window.removeEventListener("resize", this.handleResize);
  }
}

// export default TransferElements;
window.TransferElements = TransferElements;
