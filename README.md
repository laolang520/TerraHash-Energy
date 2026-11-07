# TerraHash Energy — Official Website

官方网站：https://www.terrahashenergy.com/

本仓库维护 TerraHash Energy 官方网站的正式页面与其依赖资源。**正式网站从仓库根目录部署**，而非旧版原型子目录。

## 发布方式

- GitHub Pages 使用 `main` 分支，通过 `.github/workflows/pages.yml` 自动构建和发布。
- `CNAME` 指向 `www.terrahashenergy.com`；`.nojekyll`、favicon、`styles.css` 和 `script.js` 是正式站点资源。
- 根目录的正式 `.html` 页面包括官网首页、公司介绍、团队与治理、解决方案、招聘、能源与数字市场、数字资产、新闻和联系页面。
- `milestone-history/` 用于官网里程碑页面链接的历史详情。
- `downloads/governance/` 保存官网可下载的公司治理文件。
- `assets/` 和根目录图片只保留正式页面实际使用的素材。

## 发布规范

正式网页必须经过审核后再放入发布目录。草稿、预览页面、测试原型和不再使用的素材不要提交到 `main`；建议保存在独立的开发分支或仓库外部。网站发布构建目前以根目录作为 Pages 上传路径。

如果要调整官网，请先确认导航、静态资源、下载链接和里程碑详情页仍可正常使用。
