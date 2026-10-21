---
title: Certbot
date: '2021-03-11'
description: >-
  Certbot သုံးပြီး HTTPS Certificate ကို install လုပ်မယ်။ တကယ်တော့ https ကို
  install လုပ်ရတာ အရမ်းလွယ်ပါတယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Certbot'
---
> Certbot သုံးပြီး HTTPS Certificate ကို install လုပ်မယ်။

တကယ်တော့ https ကို install လုပ်ရတာ အရမ်းလွယ်ပါတယ်။

အရင်ဆုံး Certbot Website ကိုသွားပါမယ်။

[certbot.eff.org](https://certbot.eff.org/)

![Screen Shot 2021-09-20 at 21.23.37.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1632149639971/QAQJJwUuO.png)

အဲ့မှာ My HTTP website is running က _**Software**_ နေရာမှာ ကိုယ်သုံးထားတဲ့ Web Server ကိုရွေးပါ။ _**System**_ နေရာမှာ ကိုယ်သုံးထားတဲ့ Operation System ကို ရွေးပါ။

အဲ့ဒါဆိုရင် သူ့အောက်မှာ ဘယ် command တွေ ဘယ်လို run ရမလဲဆိုတာ ပေါ်လာပါတယ် အဲ့အတိုင်းလိုက်လုပ်ရုံပါပဲ။

နမူနာ အနေနဲ့ Nginx နဲ့ Ubuntu 20.04 မှာ install လုပ်ပါမယ်။

```bash
sudo apt update
sudo apt install snapd
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

Https ကို install လုပ်ဖို့

```bash
sudo certbot --nginx
```

လို့ run လိုက်ရင် server မှာ configure လုပ်ထားတဲ့ domain list ပေါ်လာပါမယ်။

ကိုယ် install လုပ်ချင်တဲ့ domain ကိုရွေးရုံပါပဲ။

Redirect လုပ်မလားမေးရင် redirect လုပ်တာရွေးလိုက်ပါ။

ဒါဆို ကိုယ်ရွေးထားတဲ့ domain မှာ [Let's Encrypt](https://letsencrypt.org/)'s Certificate ကို install လုပ်သွားမှာပါ။

အဲ့ဒါဆို https ရပါပြီ။

ဒီနေရာမှာ [Let's Encrypt's](https://letsencrypt.org/) Certificate က ရက် 90 ဆို သက်တမ်းကုန်ပါတယ်။

သက်တမ်းမကုန်ခင် renew လုပ်ပေးဖို့လိုပါတယ်။

Renew လုပ်ဖို့အတွက် Cron Job မှာ ဒီလို ထည့်ပါမယ်။

```
1 1 * * * certbot renew --post-hook "systemctl reload nginx"
```

အဲ့ဒါဆို ရပါပြီ။ သိချင်တာရှိရင်လည်း မေးလို့ရပါတယ် ခင်ဗျာ။
