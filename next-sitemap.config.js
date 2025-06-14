/* eslint-disable @typescript-eslint/no-require-imports */
const { getPostList, getSeriesPostList } = require("./scripts/posts-data");

function formatDate(date) {
  const defaultDate = new Date().toISOString().split("T")[0];

  if (!date) return defaultDate;

  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? defaultDate : d.toISOString().split("T")[0];
  } catch (error) {
    console.warn(`Invalid date format: ${date}`);
    return defaultDate;
  }
}

module.exports = {
  siteUrl: "https://nullisdefined.site",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/*", "/api/*"],
      },
    ],
    additionalSitemaps: ["https://nullisdefined.site/sitemap.xml"],
  },
  exclude: ["/devlog/admin/*", "/admin/*", "/api/*"],
  sitemapSize: 5000,
  priority: 0.7,
  changefreq: "weekly",

  async additionalPaths() {
    try {
      const [posts, seriesPosts] = await Promise.all([
        getPostList(),
        getSeriesPostList(),
      ]);
      const uniqueUrls = new Map();

      // 메인 페이지
      uniqueUrls.set("/", {
        loc: "/",
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString().split("T")[0],
      });

      // 메인 페이지
      uniqueUrls.set("/devlog", {
        loc: "/devlog",
        changefreq: "daily",
        priority: 0.9,
        lastmod: new Date().toISOString().split("T")[0],
      });

      // 카테고리 리스트 페이지
      const categories = new Set(posts.map((post) => post.urlCategory));
      categories.forEach((category) => {
        uniqueUrls.set(`/devlog/categories/${category}`, {
          loc: `/devlog/categories/${category}`,
          changefreq: "weekly",
          priority: 0.8,
          lastmod: new Date().toISOString().split("T")[0],
        });
      });

      // 시리즈 리스트 페이지
      const series = new Set(
        seriesPosts.map((post) => post.urlCategory.replace("series/", ""))
      );
      series.forEach((seriesName) => {
        uniqueUrls.set(`/devlog/series/${seriesName}`, {
          loc: `/devlog/series/${seriesName}`,
          changefreq: "weekly",
          priority: 0.8,
          lastmod: new Date().toISOString().split("T")[0],
        });
      });

      // 일반 포스트
      posts.forEach((post) => {
        const url = `/devlog/posts/${post.urlCategory}/${post.slug}`;
        uniqueUrls.set(url, {
          loc: url,
          lastmod: formatDate(post.date),
          changefreq: "monthly",
          priority: 0.9,
        });
      });

      // 시리즈 포스트
      seriesPosts.forEach((post) => {
        const url = `/devlog/posts/series/${post.urlCategory.replace(
          "series/",
          ""
        )}/${post.slug}`;
        uniqueUrls.set(url, {
          loc: url,
          lastmod: formatDate(post.date),
          changefreq: "monthly",
          priority: 0.9,
        });
      });

      return Array.from(uniqueUrls.values());
    } catch (error) {
      console.error("Failed to generate additional paths:", error);
      return [];
    }
  },

  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
