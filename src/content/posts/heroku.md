---
title: Heroku
date: '2020-04-12'
description: >-
  ကိုယ့်မှာရှိတဲ့ projects တွေကို cloud ပေါ် တင်မယ်။ Heroku ဆိုတာ application
  တွေကို cloud မှာ တည်ဆောက်လို့ရတဲ့ platform တစ်ခုပါ။ ပြီးတော့ Personal use ဆို
  free ပါ။
image: 'https://og.pyaesoneaung.dev/og?title=Heroku'
---
> ကိုယ့်မှာရှိတဲ့ projects တွေကို cloud ပေါ် တင်မယ်။

Heroku ဆိုတာ application တွေကို cloud မှာ တည်ဆောက်လို့ရတဲ့ platform တစ်ခုပါ။ ပြီးတော့ Personal use ဆို free ပါ။

နမူနာ အနေနဲ့ Stay At Home နာမည်နဲ့ HTML project တစ်ခု create လုပ်ပါမယ်။

![Screen Shot 2021-09-20 at 20.44.59.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1632147369815/gb1c2JZrW.png)

composer.json နဲ့ index.php အကြောင်းပြောပါမယ်။ ကျွန်တော်တို့တွေ heroku ပေါ်တင်တဲ့ အခါ php project အနေနဲ့ တင်မှာမို့ပါ။

### composer.json

သာမန် php ပဲ run မှာမို့ ဘာမှမလိုပါဘူး။ {} ဆိုရပါပြီ။

### index.php

```php
<?php
    include_once("index.html");
?>
```

index.html ကို run မယ်လို့ရေးထားတာပါ။ (Browser က လာ ခေါ်ရင် index.php ကို အရင် စခေါ်မှာမို့ပါ။)
Heroku ပေါ်တင်တဲ့အခါ git နဲ့တင်မှာမို့လို့ project ထဲမှာ git ထည့်ပါမယ်။

```bash
git init
git add .
git commit -m "initial commit"
```

## Installation Heroku

Heroku account လိုပါတယ်။ [ဒီမှာ](https://signup.heroku.com/) လုပ်ပါ။
Heroku CLI လိုပါတယ်။ [ဒီမှာ](https://devcenter.heroku.com/articles/heroku-cli) လုပ်ပါ။
ပြီးရင် terminal ကနေ

```bash
heroku login
```

ဆိုပြီး login ဝင်ပါ။ ပြီးရင် project root folder ထဲကနေ Heroku app တစ်ခု create လုပ်ပါမယ်။

```bash
heroku create stayathomemyanmar
```

stayathomemyanmar မှာ ကြိုက်နှစ်သက်ရာ နာမည် ပြောင်းလို့ရပါတယ်။ stayathomemyanmar ဆိုရင် [stayathomemyanmar.heroku.com](https://stayathomemyanmar.herokuapp.com/) ဆိုပြီးဖြစ်မှာပါ။ abc ဆိုရင် abc.heroku.com ဆိုပြီးဖြစ်မှာပါ။ အဲ့ဒါကြောင့် unique ဖြစ်တဲ့ နာမည်တော့ရွေးပေးရပါမယ်။

app တစ်ခုရပြီဆိုတော့ project ကို heroku ပေါ်တင်ဖို့ terminal ကနေ

```bash
git push heroku master
```

ဒါဆို ရပါပြီ။ [stayathomemyanmar.heroku.com](https://stayathomemyanmar.herokuapp.com) ဆိုပြီး ကြည့်လို့ရပါပြီ။

## Conclusion

တကယ့် လက်တွေ့ production မှာတော့ ဒီလိုမျိုး မလွယ်ကူပါဘူး။ Domain တွေ၊ Server တွေ၊ Nginx (သို့) Apache စသည်ဖြင့် အများကြီးလိုအပ်ပါတယ်။ Heroku ကိုတော့ personal project တွေပဲသုံးဖို့ အကြံပေးပါတယ်။ Heroku နဲ့ ပတ်သတ်ပြီး နောက်ထပ် လေ့လာစရာတွေ အများကြီး ရှိပါသေးတယ်။ [ဒီမှာ](https://devcenter.heroku.com/) ထပ်မံ လေ့လာဖို့ တိုက်တွန်းပါတယ်။ သိချင်တာရှိရင်လည်း မေးလို့ရပါတယ် ခင်ဗျာ။
