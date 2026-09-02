# TerraHash Energy

新能源 × 数字资产基础设施公司的开源官网与项目原型。

> 定位：把可再生能源项目的数据、发电量与数字资产基础设施连接起来，提供透明的数据展示、项目管理与合规预留接口。
>
> 注意：本项目是产品/技术原型，不构成证券发行、投资建议、代币发行或金融服务。

## 项目结构

- `web/` — 静态官网，可直接部署到 GitHub Pages
- `docs/` — 公司与产品说明
- `contracts/` — 数字资产登记的示例接口（仅原型，不用于真实资金）
- `data/` — 示例新能源项目数据
- `.github/workflows/` — GitHub Pages 自动部署

## 本地运行

直接打开 `web/index.html` 即可；也可以：

```bash
python -m http.server 8080 --directory web
```

然后访问 `http://localhost:8080`。

## GitHub Pages

本仓库已配置 GitHub Actions 自动部署。进入 Settings → Pages，选择 GitHub Actions 作为发布方式。

## Homepage Visual

The homepage uses the English corporate hero visual at `assets/homepage-hero.jpg`.
