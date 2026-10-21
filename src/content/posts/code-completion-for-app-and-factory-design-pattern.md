---
title: Code Completion for Laravel app()
date: '2023-11-12'
description: >-
  Code Completion အကြောင်း မပြောခင် Laravel Service Container ကို အကြမ်းဖျင်း
  နည်းနည်း ရှင်းပြချင်ပါတယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Code Completion for Laravel app()'
---
## Service Container

Code Completion အကြောင်း မပြောခင် Laravel Service Container ကို အကြမ်းဖျင်း နည်းနည်း ရှင်းပြချင်ပါတယ်။
Service Container မှာ အဓိက ၂ ပိုင်း ရှိပါတယ်။ Class တွေရဲ့ dependency တွေကို manage လုပ်တာနဲ့ dependency injection လုပ်ပေးတာပါ။

### Binding

Dependency ကို manage လုပ်တယ်ဆိုတာက ဉပမာ ApiClient class တစ်ခုရဲ့ constructor မှာ $endpoint နဲ့ $apiKey လိုတယ်ဆိုရင် config ထဲက ဘယ် key တွေကို pass လိုက်ပါဆိုပြီး သတ်မှတ်တာကို ဆိုလိုတာပါ။

```php
$this->app->bind(ApiClient::class, function () {
    return new ApiClient('https://example.com', 'example-key');
});
```

ဒါဆိုရင် ApiClient class ကို resolve လုပ်ရင် ApiClient ရဲ့ constructor မှာ `https://example.com` နဲ့ `example-key` ကို laravel က pass ပေးသွားမှာပါ။ တကယ့် real world project မှာတော့ အပေါ်က code လို ရိုးရိုး မ bind ဘဲ singleton method ကို သုံးပြီး bind ပါတယ်။

```php
$this->app->singleton(ApiClient::class, function () {
    return new ApiClient('https://example.com', 'example-key');
});
```

ဘာကွာလဲဆိုရင် singleton method က တစ်ခါပဲ resolve လုပ်ပေးမှာ။ `app(ApiClient::class)` ဆိုပြီး object တစ်ခါဆောက်ပြီးရင် နောက်တစ်ခါ နောက်တစ်နေရာမှာ `app(ApiClient::class)` လို့ခေါ်လည်း object အသစ်မဆောက်ဘဲ ပထမ ဆောက်ထားတဲ့ object ပဲ return ပြန်မှာပါ။

### Resolving

`app()` ဆိုတာက dependency တွေကို reslove ဖို့သုံးတာပါ။ `app(ApiClient::class)` လို့ ခေါ်လိုက်ရင် service container မှာ bind ထားတဲ့အတိုင်း ApiClient ရဲ့ constructor မှာ $endpoint နဲ့ $apiKey pass ပြီး  create လုပ်ထားတဲ့ object ကိုရမှာပါ။

ဒီလောက်ဆို Service Container အကြောင်းကို အကြမ်းဖျင်း နားလည်မယ်ထင်ပါတယ်။ အသေးစိတ်သိချင်ရင် [ဒီမှာ](https://laravel.com/docs/10.x/container) ကြည့်လို့ရပါတယ်။

## Code Completion

Code completion အတွက်ရှင်းပြဖို့ လွယ်သွားအောင် စောနက example ကို အခုလိုပြင်ရေးလိုက်ပါမယ်။

```php
$this->app->singleton('apiClient', function () {
    return new ApiClient('https://example.com', 'example-key');
});
```

`app('apiClient')` လို့ခေါ်ရင် `ApiClient` object ရပါမယ်။ အဲ့မှာ `ApiClient` class ရဲ့ function ဖြစ်တဲ့ `login()` ကို အခုလို ခေါ်မယ်ဆိုရင် IDE က မသိပါဘူး။

```php
app('apiClient')->login($phone, $otp);
```

ဘာလို့ မသိတာလဲဆိုတော့ Laravel က dependency ကို runtime မှာ reslove လုပ်သွားလို့ပါ။ IDE က php runtime မှာ dependency ဘယ်လို reslove လုပ်သွားတယ်ဆိုတာ မသိနိုင်ပါဘူး။ အဲ့တာကို ဖြေရှင်းဖို့ [PhpStorm advanced metadata](https://www.jetbrains.com/help/phpstorm/ide-advanced-metadata.html) ကို အသုံးပြုလို့ရပါတယ်။ အဲ့တွက် PhpStorm ရှိဖို့လည်းမလိုပါဘူး။ `.phpstorm.meta.php` ကို နားလည်တဲ့ PHP code intelligence တစ်ခုရှိရင် ရပါပြီ။

နမူနာအနေနဲ့ vscode မှာ setup လုပ်ပါမယ်။ အရင်ဆုံး `.phpstorm.meta.php` ကို နားလည်တဲ့ [PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client) extension သွင်းထားရပါမယ်။ ပြီးရင် `.phpstorm.meta.php` ဆိုတဲ့ file တစ်ခု create ပြီး အခုလိုရေးပါမယ်။

```php
<?php

namespace PHPSTORM_META {
    override(\app(0), map([
        'apiClient' => \App\Services\ApiClient::class,
    ]));
}
```

`app()` function ကို `apiClient` string နဲ့လာခေါ်ရင် return type က `ApiClient` class လို့ သတ်မှတ်လိုက်တာပါ။ ဒါဆိုရင် vscode က အခုလို သိပါပြီ။

![code-completion-for-app-and-factory-design-pattern-img-1.png](/assets/img/blog/code-completion-for-app-and-factory-design-pattern-img-1.png)

IDE က သိစေချင်တဲ့ တခြား dependency injection တွေကိုလည်း map array ထဲမှာ ထပ်ထည့်လို့ရပါတယ်။ အခုလို ကိုယ်တိုင်မလုပ်ချင်ရင် [Laravel IDE Helper](https://github.com/barryvdh/laravel-ide-helper) package သွင်းပြီး `php artisan ide-helper:meta` ဆိုပြီး run လည်းရပါတယ်။ သူကတော့ ရှိသမျှ class တွေ အားလုံးအတွက် `.phpstorm.meta.php` file မှာ generate လုပ်သွားမှာပါ။
