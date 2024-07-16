#!/bin/bash

# 명령어 목록
commands=(
    "cd backend && npm run start"
    "cd frontend && npm start"
)

# 명령어 선택
echo "실행할 명령어를 선택하세요:"
for i in "${!commands[@]}"; do
    echo "$((i + 1)). ${commands[$i]}"
done

# 사용자 입력 받기
read -p "번호를 입력하세요: " selection

# 입력 값이 유효한지 확인
if [[ $selection -gt 0 && $selection -le ${#commands[@]} ]]; then
    commandToRun=${commands[$((selection - 1))]}
    echo "선택한 명령어: $commandToRun"
    eval $commandToRun
else
    echo "유효하지 않은 선택입니다. 스크립트를 다시 실행하세요."
fi