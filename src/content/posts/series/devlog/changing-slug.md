---
title: "슬러그 변동 문제"
slug: "changing-slug"
date: 2024-12-21
tags: ["Giscus", "SEO", "Devlog"]
category: "Series/devlog"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/fee8bf8654f93bd1b965cf1f534bc746.png"
draft: false
views: 0
---
Giscus 댓글 기능을 사용하고 있었는데 예상치 못한 문제가 발생했다. ![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/fee8bf8654f93bd1b965cf1f534bc746.png) *Github Discussions에 남아있는 이전 댓글들* ![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c5cda5064d97abd69aca0f80e91f2f3b.png) *변경된 URL로 인한 404 오류* 

게시글 제목을 수정했더니 URL이 변경되면서 기존 댓글들과의 연결이 끊어진 것이었다. Giscus는 페이지의 URL을 기준으로 댓글을 매핑하는데, 게시글 URL이 제목을 기반으로 생성되다 보니 제목이 바뀌면 URL도 함께 바뀌는 것이 문제가 되었다. 

## 해결 방안 고민
바뀌지 않는 고유의 URL이 필요했다. 처음엔 단순히 게시글마다 `/1`, `/2`와 같이 단순 번호로 관리하는 방법을 고려했다. 하지만 이런 방식은 URL만 보고는 게시글 내용을 유추할 수 없고, 프로젝트 내에서 관리도 어려워진다. URL은 단순한 경로 이상의 의미가 있었는데, 검색 엔진 최적화에도 영향을 미치고, 다른 곳에서 링크를 걸 때도 URL만 보고 의미를 짐작할 수 있게 된다.

### 해결책
결국 여러 방법을 고민하다가 frontmatter에 slug 필드를 추가하기로 했다.

```md
---
title: "Devlog 시작"
slug: "devlog-시작"
date: 2024-10-28
tags: []
category: "Series/devlog"
draft: false
---
```

이렇게 하면 다음의 장점을 가진다. 
- URL로 어느정도 게시글의 내용을 유추할 수 있다 
- 제목은 자유롭게 수정할 수 있으면서도 URL은 일관성있게 유지된다 

SEO 관점에서도 좋은 URL 구조를 가질 수 있다 옵시디언의 Markdown 파일들을 프로젝트 폴더와 동기화하는 sync-blog.ts에도 간단한 수정이 필요했다.

```ts
interface FrontMatter {
  title: string;
  slug?: string;
  category?: string;
  tags?: string[];
}

let slug: string;
if (frontMatter.slug) {
  // frontmatter에 명시된 slug를 URL Friendly하게 변환 후 사용
  slug = this.createSlug(frontMatter.slug);
} else {
  // 기존 글이면 현재 slug 유지, 새 글이면 제목으로 생성
  const existingSlug = this.findExistingSlug(frontMatter.title);
  slug = existingSlug || this.createSlug(frontMatter.title);
}

private createSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^가-힣a-z0-9]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}
```

## 마치며
slug가 지정된 경우 그 값을 우선적으로 사용하고, 그렇지 않은 경우 기존 방식을 따르게 된다. 지금 이미 작성된 글들의 URL은 유지하면서, 앞으로는 안정적인 URL 관리가 가능해졌다.

이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/mydevlog)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.