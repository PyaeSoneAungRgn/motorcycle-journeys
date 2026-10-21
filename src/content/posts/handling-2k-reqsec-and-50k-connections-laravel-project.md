---
title: Handling 2K req/sec & 50K Connections
date: '2022-06-11'
description: >-
  2,000 requests per sec ရှိတဲ့ ကျွန်တော်ရဲ့ project တစ်ခုကို load balancing
  architecture နဲ့ handle လုပ်ထားတာကို knowledge sharing လုပ်ချင်ပါတယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Handling 2K req/sec & 50K Connections'
---
![Screen Shot 2022-06-10 at 22.03.41.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1654882472690/NmzlfePxY.png)

2,000 requests per sec ရှိတဲ့ ကျွန်တော်ရဲ့ project တစ်ခုကို load balancing architecture နဲ့ handle လုပ်ထားတာကို knowledge sharing လုပ်ချင်ပါတယ်။

အရင်ဆုံး request တွေ အများကြီးကို handle လုပ်ပြီဆိုကတည်းက server ပိုင်းမှာ level တစ်ခုရောက်ပြီလို့ ယူဆပြီး အသေးစိတ်မပြောတော့ပဲ အရေးကြီးတဲ့ အပိုင်းတွေကိုပဲ ရွေးပြောသွားပါမယ်။

![Load Balancing.jpeg](https://cdn.hashnode.com/res/hashnode/image/upload/v1654878295044/1he7ASQ0R.jpeg)

ကျွန်တော် load balancing setup လုပ်ထားတာကို dragram အကြမ်းဆွဲပြထားတာပါ။

အရင်ဆုံး user တွေက load balancer ကိုလာပါမယ်။ Load balancer က တစ်ဆင့် web server အသေးလေးတွေကို requests တွေခွဲပေးပါမယ်။ Web server အသေးလေးတွေရဲ့ data တွေ၊ cache တွေတူအောင်လို့ mysql နဲ့ redis တစ်လုံးထဲကနေဆွဲပါမယ်။ Socket ဆာဗာကတော့ app မှာ real-time data တွေ ပြတဲ့ features ပါလို့ သုံးထားတာပါ။ Socket က ချိတ်နေတဲ့ အတွက် connections က 51K ထိတက်ပါတယ်။

ဒီနေရာမှာ အရေးကြီးမယ်ထင်တာတွေကို ပြောပြချင်ပါ။

Load balancer က ကိုယ့် project နဲ့ ကိုက်ညီမယ့် plan ကို ကြိုက်သလို ရွေးလို့ရပါတယ်။

Web server တွေကို Debian နဲ့ Nginx သုံးပြီး setup လုပ်ထားပါတယ်။ အဲ့မှာ သတိထားရမှာက linux က maximum file open limit ကို 1024 ပဲ default ထားထားတာပါ။ အဲ့မှာ request တိုင်းအတွက် log ရိုက်တာတွေ၊ config တွေဖတ်တာတွေ၊ တခြား process တွေ လည်း file open တာတွေ လုပ်ရပါတယ်။ Requests တွေ အများတွေ ဝင်လာရင် 1024 က မလောက်ပါဘူး တိုးဖို့လိုလာပါတယ်။ [https://gist.github.com/denji/8359866](https://gist.github.com/denji/8359866) အတိုင်းလုပ်ရင်တော့ 1024 မှာ limit ဖြစ်နေကို ဖြေရှင်းနိုင်မှာပါ။ php-fpm ကို static mode လုပ်ပြီး max child ကို ram နဲ့တွက်ပြီး setup လုပ်ထားပါတယ်။ [https://geekflare.com/php-fpm-optimization](https://geekflare.com/php-fpm-optimization/) မှာ php-fpm static mode အတွက် ရှင်းပြထားပါတယ်။

Database server နဲ့ Redis server ကိုတော့ DigitalOcean မှာ built-in ပေးတဲ့ service ကိုမသုံးဘဲ ကိုယ်တိုင် droplet ယူပြီး setup လုပ်ထားပါတယ်။ Database နဲ့ Redis server ကို web server ကနေ private ip သုံးပြီး ချိတ်ပါတယ်။ Firewall သုံးဖို့လည်း မမေ့ပါနဲ့။ ဉပမာ database server port 3306 ကို web server ip တွေမှသာ လာပြီး ခေါ်လို့ အောင် လုပ်ထားသင့်ပါတယ်။ Redis server prot 6379 ကိုလည်း web server တွေပဲ လာခေါ်လို့ရအောင် လုပ်ထားသင့်ပါတယ်။ (ssh port ကိုတော့ သွားမလုပ်ပါနဲ့ 😜)

ဒါတွေကတော့ ကျွန်တော်အရေးကြီးမယ်ထင်တဲ့ အချက်တွေပါ။ တခြား project အတွက်ဆိုရင် cache usage ပိုများလား၊ databae query သုံးတာပိုများလား စတဲ့ အချက်တွေ ကိုကြည့်ပြီး setup လုပ်ပုံ ပြောင်းလဲသွားနိုင်ပါတယ်။

ဒီနေရာမှာ ကျွန်တော်ကိုယ်တိုင် သေချာ research မလုပ်ရသေးတဲ့ အပိုင်းတွေလည်း ရှိတာမို့လို့ မှားတာရှိရင် ထောက်ပြပေးလို့ရပါတယ်။ သိချင်တာရှိရင် လည်း မေးလို့ရပါတယ် ခင်ဗျာ။
