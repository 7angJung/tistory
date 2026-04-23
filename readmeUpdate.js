import { writeFileSync } from "node:fs";
import Parser from "rss-parser";

// ----- [1] 고정 영역 -----
const staticContent = `
# JUPETER Notebook's Tech Blog 👋

주피터 CS, 개발일지, 이모저모 개발 블로그

## Latest Blog Posts
`;

// ----- [2] 자동 갱신 영역 -----
const parser = new Parser({
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml; q=0.1",
  },
});

(async () => {
  let blogSection = "";

  try {
    const feed = await parser.parseURL("https://jupeternotebook.tistory.com/rss");

    const latestPostsCount = 5;

    for (let i = 0; i < latestPostsCount && i < feed.items.length; i++) {
      const { title, link } = feed.items[i];
      console.log(`${i + 1}번째 게시물: ${title} (${link})`);
      blogSection += `- [${title}](${link})\n`;
    }
  } catch (error) {
    console.error("RSS 파싱 중 오류 발생:", error);
    blogSection += "블로그 글을 불러오지 못했습니다.\n";
  }

  // ----- [3] README.md 파일 작성 -----
  const finalContent = staticContent + "\n" + blogSection;
  writeFileSync("README.md", finalContent, "utf8");

  console.log("README 업데이트 완료");
})();