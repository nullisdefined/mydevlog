---
title: "[Thumbs Up] 텍스트 커스터마이징 기능 구현하기"
slug: "thumbs-up-customizing-typography"
date: 2024-10-30
tags: ["React", "TypeScript", "TailwindCSS", "ToyProject"]
category: "Series/Toy-Project"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a32305c4997a041b5d69663a3a99fe2c.png"
draft: false
views: 0
---
텍스트 커스터마이징 기능을 구현한 과정이다.

## 주요 기능
1. 텍스트 스타일
	- 굵게, 이탤릭, 그림자 효과 추가
	- 텍스트 색상 변경
2. 텍스트 레이아웃
	- 정렬 옵션 (왼쪽, 중앙, 오른쪽 정렬)
	- 제목과 부제목 크기 조절
3. 폰트 선택
	- Gmarket Sans, 나눔스퀘어 네오, Pretendard

## 1. 텍스트 입력과 스타일링
사용자가 입력한 텍스트를 상태로 관리하며 스타일을 바로바로 조정할 수 있도록 했다.

```tsx
<Input
  type="text"
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Enter text"
  className="flex-grow"
/>
<Toggle
  pressed={isBold}
  onPressedChange={setIsBold}
  aria-label="Toggle bold"
>
  <Bold className="w-4 h-4" />
</Toggle>
<Toggle
  pressed={isItalic}
  onPressedChange={setIsItalic}
  aria-label="Toggle italic"
>
  <Italic className="w-4 h-4" />
</Toggle>
<Input
  type="color"
  value={textColor}
  onChange={(e) => setTextColor(e.target.value)}
  className="w-10 h-10 p-1 rounded"
/>
```

- 텍스트 상태를 `text`로 관리하고, 굵기와 기울임 여부를 `isBold`, `isItalic` 상태로 관리했다.
- `Input` 컴포넌트로 텍스트와 색상을 입력받고, `Toggle` 컴포넌트로 스타일 옵션을 적용했다.

## 2. 텍스트 레이아웃
텍스트를 왼쪽, 중앙, 오른쪽으로 정렬할 수 있게 버튼을 구성했다.

```tsx
<Button
  variant={textStyle.align === "left" ? "default" : "outline"}
  onClick={() => handleTextStyleChange("align", "left")}
  className="flex-1"
>
  <AlignLeft className="h-4 w-4" />
</Button>
<Button
  variant={textStyle.align === "center" ? "default" : "outline"}
  onClick={() => handleTextStyleChange("align", "center")}
  className="flex-1"
>
  <AlignCenter className="h-4 w-4" />
</Button>
<Button
  variant={textStyle.align === "right" ? "default" : "outline"}
  onClick={() => handleTextStyleChange("align", "right")}
  className="flex-1"
>
  <AlignRight className="h-4 w-4" />
</Button>
```

`textStyle.align`을 기준으로 버튼의 상태를 변경하고, 사용자가 선택한 정렬 옵션을 `handleTextStyleChange`로 처리한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a32305c4997a041b5d69663a3a99fe2c.png)
*텍스트 커스터마이징 인터페이스*

## 3. 폰트 선택
미리 준비한 폰트 리스트를 선택할 수 있도록 구성했다.

```tsx
const FONTS = [
  { name: "GmarketSans", label: "Gmarket Sans" },
  { name: "NanumSquareNeo", label: "NanumSquare Neo" },
  { name: "Pretendard", label: "Pretendard" },
];

<Select
  value={textStyle.font}
  onValueChange={(value) => handleTextStyleChange("font", value)}
>
  {FONTS.map((font) => (
    <SelectItem key={font.name} value={font.name}>
      {font.label}
    </SelectItem>
  ))}
</Select>
```

`textStyle.font` 상태를 관리하고, 사용자 선택에 따라 폰트를 업데이트한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/470e9cd56cfcc8ead89bb1efa176351b.png)
*폰트 선택 인터페이스*

## 4. 제목 및 부제목 크기 조절
제목과 부제목의 크기를 사용자가 쉽게 조절할 수 있도록 슬라이더를 추가했다.

```tsx
<div className="space-y-4">
  <div>
    <Label>Title Size</Label>
    <Slider
      value={[textStyle.fontSize]}
      onValueChange={([value]) =>
        handleTextStyleChange("fontSize", value)
      }
      min={5}
      max={20}
      step={1}
    />
  </div>
  <div className="flex items-center justify-between">
    <Label htmlFor="show-subtitle">Show Subtitle</Label>
    <Switch
      id="show-subtitle"
      checked={showSubtitle}
      onCheckedChange={setShowSubtitle}
    />
  </div>
  {showSubtitle && (
    <div>
      <Label>Subtitle Size</Label>
      <Slider
        value={[textStyle.subFontSize]}
        onValueChange={([value]) =>
          handleTextStyleChange("subFontSize", value)
        }
        min={3}
        max={15}
        step={1}
        disabled={!showSubtitle}
      />
    </div>
  )}
</div>
```

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/27defd81d37ed144d844d1c9c21ff247.png)
*텍스트 크기 조절 인터페이스*

## 5. 캔버스에 텍스트 그리기
선택한 스타일과 폰트를 적용해 캔버스에 텍스트를 그린다.

```tsx
ctx.fillStyle = textStyle.color;
ctx.textAlign = textStyle.align;
ctx.textBaseline = "middle";
ctx.font = `${textStyle.italic ? "italic " : ""}${
  textStyle.bold ? "bold" : "normal"
} ${fontSize}px ${textStyle.font}, Arial`;

let x;
switch (textStyle.align) {
  case "left":
    x = 20;
    break;
  case "center":
    x = canvas.width / 2;
    break;
  case "right":
    x = canvas.width - 20;
    break;
  default:
    x = canvas.width / 2;
}

ctx.fillText(text, x, canvas.height / 2);
```

- `ctx.font`를 통해 굵기, 이탤릭 여부, 폰트를 동적으로 설정한다.
- `textAlign`과 `x` 위치 값을 설정해 텍스트를 정렬한다.

---
이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/thumbs-up)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.