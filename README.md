# GPS 经纬度

在带有 GPS 的设备上读取当前纬度和经度。浏览器不提供“是否有 GPS 芯片”的接口，因此页面只接受高精度、未缓存、精度在 50 米以内的定位。否则提示：无法获取，当前设备不存在 GPS 功能。

线上地址：<https://gps.jiawen.live>

```bash
pnpm dev
```

开发地址：<http://localhost:3310>

## Docker

```bash
docker build -t get-gps .
docker run --rm -p 3000:3000 get-gps
```

镜像使用 Next.js `standalone` 输出，容器内监听 `3000`。
