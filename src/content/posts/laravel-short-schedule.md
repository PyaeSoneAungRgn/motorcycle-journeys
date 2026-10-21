---
title: Laravel Short Schedule
date: '2021-03-29'
description: >-
  Artisan Command တွေကို စက္ကန့်တိုင်း run မယ်။ အရင်ကတော့ command တွေကို
  စက္ကန့်တိုင်း run ချင်ရင် infinite loop တစ်ခုပတ်ပြီး sleep(1) ဆိုပြီး
  ရေးချင်တာရေးပါတယ် (လိုက်မလုပ်ပါနဲ့ :3)။ အခုတော့ laravel-short-schedule
  ကိုသုံးပြီး နည်းစနစ် မှန်မှန် လုပ်လို့ရပါပြီ။
image: 'https://og.pyaesoneaung.dev/og?title=Laravel Short Schedule'
---
> Artisan Command တွေကို စက္ကန့်တိုင်း run မယ်။

အရင်ကတော့ command တွေကို စက္ကန့်တိုင်း run ချင်ရင် infinite loop တစ်ခုပတ်ပြီး sleep(1) ဆိုပြီး ရေးချင်တာရေးပါတယ်။ (လိုက်မလုပ်ပါနဲ့ :3)

အခုတော့ [laravel-short-schedule](https://github.com/spatie/laravel-short-schedule) ကိုသုံးပြီး နည်းစနစ် မှန်မှန် လုပ်လို့ရပါပြီ။

အရင်ဆုံး package ကို install လုပ်ပါမယ်။

```bash
composer require spatie/laravel-short-schedule
```

ပြီးရင် **app\\Console\\Kernel.php** မှာ **shortSchedule** ဆိုတဲ့ function တစ်ခုလုပ်ပြီး ကိုယ် run ချင်တဲ့ command ထည့်ပါမယ်။

```php
protected function shortSchedule(\Spatie\ShortSchedule\ShortSchedule $shortSchedule)
{
    $shortSchedule->command('inspire')->everySecond();
}
```

နောက်ဆုံး

```bash
php artisan short-schedule:run
```

လို့ run လိုက်ရင် **shortSchedule** function ထဲက command တွေကို သတ်မှတ်ထားတဲ့ အချိန်အလိုက် run နေမှာပါ။

အခုနမူနာအရဆို _inspire_ ဆိုတဲ့ command ကို တစ်စက္ကန့်တိုင်း run နေမှာပါ။

5 စက္ကန့်တိုင်း run ချင်ရင်

```php
$shortSchedule->command('inspire')->everySeconds(5);
```

Overlap မဖြစ်အောင် run ချင်ရင်

```php
$shortSchedule->command('inspire')->withoutOverlapping()->everySecond();
```

သတ်မှတ်ထားတဲ့ အချိန်အတွင်း run ချင်ရင်

```php
$shortSchedule->command('inspire')->between('09:00', '17:00')->everySecond();
```

တခြား option တွေလည်းရှိပါသေးတယ်။ [ဒီမှာ](https://github.com/spatie/laravel-short-schedule#usage) ကြည့်လို့ရပါတယ်။

Production မှာဆိုရင်

```bash
php artisan short-schedule:run
```

ကို [supervisor](http://supervisord.org/) သုံးပြီး background process အနေနဲ့ run ဖို့လိုပါတယ်။ ဒါဆို ရပါပြီ။

ဆက်လက်ပြီး နောက်ကွယ်ကနေ ဘယ်လို အလုပ်လုပ်သွားတယ်ဆိုတာ ကျွန်တော်သိလောက် share ချင်ပါတယ်။

(နောက်ကွယ်က လုပ်တာတွေ မသိလည်းဘာမှ မဖြစ်ပါဘူး အလုပ်ဖြစ်ရင် အဆင်ပြေပါတယ်။ သိတော့ ကိုယ်အရေးတဲ့ code အပေါ်ကို ပိုပြီး confident ရှိတာပေါ့ 😁)

နောက်ကွယ်ကနေ အမြဲ run နေဖို့ အတွက်ကို [React PHP](https://reactphp.org/) ရဲ့ [EventLoop](https://reactphp.org/event-loop/) ကို သုံးထားတာပါ။

ဒီ video မှာ Event Loop ဘယ်လို အလုပ်လုပ်တယ် ဆိုတာ ရှင်းပြထားပါတယ်။

[![IMAGE_ALT](https://img.youtube.com/vi/mJFbYHYxSDg/0.jpg)](https://www.youtube.com/watch?v=mJFbYHYxSDg)

Ref : [https://freek.dev/1743-how-to-schedule-commands-to-run-every-few-seconds-in-a-laravel-app](https://freek.dev/1743-how-to-schedule-commands-to-run-every-few-seconds-in-a-laravel-app)
