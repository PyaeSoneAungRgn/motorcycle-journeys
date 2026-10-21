---
title: Laravel Macros
date: '2022-02-03'
description: >-
  Laravel macros ဆိုတာကတော့ Laravel Framework ရဲ့ feature တစ်ခုပါ။ Laravel
  macros က Laravel ရဲ့ core components တွေမှာ မရှိတဲ့ functions တွေကို
  ထပ်ထည့်လို့ရအောင် လုပ်ပေးပါတယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Laravel Macros'
---
Laravel macros ဆိုတာကတော့ Laravel Framework ရဲ့ feature တစ်ခုပါ။ Laravel macros က Laravel ရဲ့ core components တွေမှာ မရှိတဲ့ functions တွေကို ထပ်ထည့်လို့ရအောင် လုပ်ပေးပါတယ်။

ကျွန်တော် နမူနာ အနေနဲ့ macors တချို့ ရေးပြပါမယ်။

Macro ရေးဖို့ အရင်ဆုံး ကိုယ်သုံးမယ့် class က **Macroable** trait ကို သုံးထားဖို့လိုပါတယ်။
လက်ရှိ Macroable trait ကို သုံးထားတဲ့ class တွေကတော့

- Illuminate\Auth\RequestGuard
- Illuminate\Auth\SessionGuard
- Illuminate\Cache\Repository
- Illuminate\Console\Command
- Illuminate\Console\Scheduling\Event
- Illuminate\Cookie\CookieJar
- Illuminate\Database\Eloquent\FactoryBuilder
- Illuminate\Database\Eloquent\Relations\Relation
- Illuminate\Database\Grammar
- Illuminate\Database\Query\Builder
- Illuminate\Database\Schema\Blueprint
- Illuminate\Filesystem\Filesystem
- Illuminate\Foundation\Testing\TestResponse
- Illuminate\Http\JsonResponse
- Illuminate\Http\RedirectResponse
- Illuminate\Http\Request
- Illuminate\Http\Response
- Illuminate\Http\UploadedFile
- Illuminate\Mail\Mailer
- Illuminate\Routing\PendingResourceRegistration
- Illuminate\Routing\Redirector
- Illuminate\Routing\ResponseFactory
- Illuminate\Routing\Route
- Illuminate\Routing\Router
- Illuminate\Routing\UrlGenerator
- Illuminate\Support\Arr
- Illuminate\Support\Collection
- Illuminate\Support\Facades\Http
- Illuminate\Support\LazyCollection
- Illuminate\Support\Str
- Illuminate\Support\Testing\Fakes\NotificationFake
- Illuminate\Translation\Translator
- Illuminate\Validation\Rule
- Illuminate\View\Factory
- Illuminate\View\View

အဲ့ထဲကမှ **Illuminate\Support\Str** class မှာ string က json string ဟုတ် မဟုတ် စစ်တဲ့ function တစ်ခု ရေးပြပါမယ်။

**AppServiceProvider.php** ထဲ က _boot()_ function မှာရေးရမှာပါ။

```php
use Illuminate\Support\Str;

public function boot()
{
    Str::macro('isJsonString', function ($str) {
        json_decode($str, true);
        return json_last_error() == JSON_ERROR_NONE;
    });
}
```

ဒါဆိုရင် ခုလိုစမ်းလို့ရပါပြီ။

```php
use Illuminate\Support\Str;

Str::isJsonString('{"foo":"bar"}'); // return true
Str::isJsonString('{"foo":"bar"} hello world'); // return false
```

ပိုပြီးမြင်သာအောင် **Illuminate\Support\Facades\Http** အတွက်လည်း ရေးပြပါမယ်။

```php
use Illuminate\Support\Facades\Http;

public function boot()
{
    Http::macro('ipLookup', function () {
        return Http::withBasicAuth('admin', 'secret')->baseUrl('https://iplookupbalabala.com');
    });
}
```

ဒါဆိုရင် api ခေါ်ဖို့ အတွက် constructor မှာ client ဆောက်စရာ မလိုပဲ ဒီလိုရေးလို့ ရပါပြီ။

```php
use Illuminate\Support\Facades\Http;

Http::ipLookup()->get('/');
```

ဒီလောက်ဆိုရင် ကိုယ့် project ရဲ့ requirements ပေါ် မူတည်ပြီး function အသစ်တွေ အများကြီး ထပ်ရေးနိုင်မယ်လို့ ထင်ပါတယ်။

Macros ကို အခုထက်ပိုပြီး စနစ်တကျရေးချင်တော့ Mixins ကိုသုံးပြီး ရေးလို့ ရပါတယ်။ အဲ့ဒါကိုတော့ နောက်အချိန်ရမှပဲ ဆက်ရေးပါတော့မယ်။
