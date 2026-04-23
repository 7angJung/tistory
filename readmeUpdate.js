import { writeFileSync } from "node:fs";
import Parser from "rss-parser";

// ----- [1] 고정 영역: 네 GitHub 프로필/소개용으로 자유롭게 수정 -----
const staticContent = `
# Hi there 👋

백엔드 개발자를 준비하고 있는 정광혁입니다.

## Tech Stack
- Java
- Spring Boot
- JUnit5
- Git / GitHub

## Latest Blog Posts
`;

// ----- [2] 자동 갱신 영역: 티스토리 RSS 읽어서 최신 글 목록 추가 -----
const parser = new Parser({
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml; q=0.1",
  },
});

(async () => {
  let blogSection = "";

  try {
    // 여기에 네 티스토리 RSS 주소 넣기
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