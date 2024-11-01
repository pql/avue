pnpm build
del ./dist/img/**
scp -P 35738 -r  ./dist/* ssh root@8.130.12.92:/back/avue/avue/avue-iot
