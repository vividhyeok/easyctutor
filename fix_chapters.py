import re

# Read the file
with open(r'c:\Users\user\Desktop\easyctutor\content\tutoring.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Chapter 11: Replace sections 11-6 through 11-11 with just 11-6
chapter_11_fix = r'''## 11-6. 다음 장

다음 장에서는 이제 "함수"로 들어갈 거예요.

지금까지 만든 코드들이 슬슬 길어졌죠.

함수는 그걸 정리해주는 도구예요.

> - 코드를 묶어서 이름 붙이기
> - 같은 로직을 다시 쓰기
> - 문제를 더 작은 조각으로 나누기
> 

---

# 12장'''

# Find and replace from 11-6 to start of 12장
pattern = r'## 11-6\..*?(?=# 12장)'
content = re.sub(pattern, chapter_11_fix, content, flags=re.DOTALL)

# Delete Chapter 22 and renumber 23 to 22
# Find chapter 22 start
pattern_ch22_start = r'# 22장\. 구조체.*?(?=# 23장)'
content = re.sub(pattern_ch22_start, '', content, flags=re.DOTALL)

# Renumber chapter 23 to 22
content = content.replace('# 23장.', '# 22장.')
content = re.sub(r'## 23-(\d+)\.', r'## 22-\1.', content)

# Write back
with open(r'c:\Users\user\Desktop\easyctutor\content\tutoring.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Chapter 11 fixed (removed 11-7 to 11-11)")
print("✅ Chapter 22 deleted")
print("✅ Chapter 23 renumbered to 22")
