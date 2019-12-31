module.exports = {
  getCenterModuleIndex: cmsConfig => {
    return (
      cmsConfig.themeConfig.construct.header.length +
      cmsConfig.themeConfig.construct.center.length -
      1
    );
  },
  // 以下為加在原型上的方法
  resetFooterIndex() {
    this.themeConfig.construct.footer[0].moduleIndex =
      this.themeConfig.construct.center.length +
      this.themeConfig.construct.left.length +
      this.themeConfig.construct.right.length +
      1;
    return this;
  }
};
