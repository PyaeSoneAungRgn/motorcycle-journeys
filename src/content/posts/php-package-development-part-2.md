---
title: PHP Package Development (Part-2)
date: '2024-02-10'
description: >-
  PHP နဲ့ Laravel Package တွေ ဖန်တီးတာကို knowledge sharing လုပ်ချင်ပါတယ်။
  ဒီအပိုင်းမှာတော့ Laravel အတွက် package တစ်ခုဖန်တီးပါမယ်။
image: 'https://og.pyaesoneaung.dev/og?title=PHP Package Development (Part-2)'
---
PHP နဲ့ Laravel Package တွေ ဖန်တီးတာကို knowledge sharing လုပ်ချင်ပါတယ်။ ဒီအပိုင်းမှာတော့ Laravel အတွက် package တစ်ခုဖန်တီးပါမယ်။

## Requirements

- [PHP Package Development (Part-1)](/posts/php-package-development-part-1)

## Setup Composer Project

Project တစ်ခု create လုပ်ဖို့အတွက်

```bash
mkdir quiz-api
cd quiz-api
composer init
```

ဆိုပြီး run ပါမယ်။

အဲ့ဒါဆိုရင် အခုလို folder structure ရပါပြီ။

```
├── src
├── vendor
└── composer.json
```

`composer.json` မှာ အခုလိုပြင်ပါမယ်။

```diff
{
    "name": "pyaesoneaung/quiz-api",
    "description": "Quiz Api Client",
    "type": "library",
    "license": "MIT",
    "autoload": {
        "psr-4": {
-           "Pyaesoneaung\\QuizApi\\": "src/"
+           "PyaeSoneAung\\QuizApi\\": "src/"
        }
    },
    "authors": [
        {
            "name": "Pyae Sone Aung",
            "email": "pyaesoneaungrgn@gmail.com"
        }
    ],
    "minimum-stability": "dev",
+   "prefer-stable": true,
    "require": {}
}
```

ဘာမှမရေးခင် အရင်ဆုံး ကိုယ့် package က Laravel version ဘယ်လောက်အနိမ့်ဆုံးလိုမယ်ဆိုတာ သတ်မှတ်ဖို့လိုပါတယ်။

`composer.json` မှာ အခုလိုပြင်ပါမယ်။

```json
"require": {
  "illuminate/contracts": "^10.0|^11.0",
  "pyaesoneaung/quiz-api-client": "^1.0"
},
"require-dev": {
  "orchestra/testbench": "^9.0|^10.0",
}
```

**"illuminate/contracts": "^10.0|^11.0"** က Laravel 10 နဲ့ 11 မှာ သွင်းလို့ရမယ်လို့ ဆိုလိုတာပါ။

**"pyaesoneaung/quiz-api-client": "^1.0"** က ကျတော်တို့ [part-1](/posts/php-package-development-part-1) မှာ ရေးထားတဲ့ package ကို install လုပ်မယ်ဆိုလိုတာပါ။

**"orchestra/testbench": "^9.0|^10.0"** က test ရေးဖို့ အတွက်ပါ။ ပြီးတော့ testbench မှာ development လုပ်နေတဲ့ အချိန်မှာလိုအပ်တဲ့ ServiceProvider တို့၊​ Facade တို့ အပြင်တခြား Laravel ရဲ့ core class တွေကို တခါထဲသွင်းသွားတဲ့ အတွက် text editor တွေရဲ့ auto complete feature ကိုလည်း အသုံးပြုနိုင်မှာပါ။ ^9.0 က Laravel 10 အတွက်ဖြစ်ပြီး ^10.0 က Laravel 11 အတွက်ပါ။ အသေးစိတ်ကိုတော့ [packages.tools](https://packages.tools) မှာ ကြည့်လို့ရပါတယ်။

## Setup Config

QuizApi ကို ခေါ်သုံးဖို့ အတွက် api key ရှိဖို့လိုပါတယ်။​ Api key ကို config ကနေ တစ်ဆင့် `.env` file ကနေ `QUIZ_API_KEY` ဆိုတဲ့ key နဲ့ ​ယူပါမယ်။ အဲ့အတွက် project root folder မှာပဲ `config` ဆိုပြီး folder တစ်ခု create လုပ်ပါမယ်။ ပြီးရင် အဲ့ folder အောက်မှာပဲ​ `quiz-api.php` ဆိုပြီး php file တစ်ခု create လုပ်ပါမယ်။

```
├── config
│   ├── quiz-api.php
├── src
├── vendor
└── composer.json
```

`quiz-api.php` မှာ အခုလိုရေးပါမယ်။

```php
<?php

return [
    'api_key' => env('QUIZ_API_KEY'),
];
```

ဒီ config file ကို Laravel framework က သိဖို့အတွက် ServiceProvider တစ်ခု create လုပ်ပြီး register လုပ်ပေးဖို့လိုပါတယ်။

`src` folder အောက်မှာ `QuizApiServiceProvider.php` ဆိုပြီး file တစ်ခု create လုပ်ပါမယ်။

```
├── config
│   ├── quiz-api.php
├── src
│   ├── QuizApiServiceProvider.php
├── vendor
└── composer.json
```

`QuizApiServiceProvider.php` မှာ အခုလိုရေးပါမယ်။

```php
<?php

namespace PyaeSoneAung\QuizApi;

use Illuminate\Support\ServiceProvider;

class QuizApiServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../config/quiz-api.php',
            'quiz-api'
        );
    }
}
```

ပြီးရင် QuizApiServiceProvider ကို `composer.json` မှာ register လုပ်ပါမယ်။

```json
"extra": {
  "laravel": {
    "providers": ["PyaeSoneAung\\QuizApi\\QuizApiServiceProvider"]
  }
}
```

ဒါဆိုရင် `config('quiz-api.api_key')` ဆိုပြီး ခေါ်သုံးလို့ရပါပြီ။

## Service Container

Laravel Service Container ကို အကြမ်းဖျင်း နည်းနည်း ရှင်းပြချင်ပါတယ်။ Service Container မှာ အဓိက ၂ ပိုင်း ရှိပါတယ်။ Class တွေရဲ့ dependency တွေကို manage လုပ်တာနဲ့ dependency injection လုပ်ပေးတာပါ။

### Binding

Dependency ကို manage လုပ်တယ်ဆိုတာက ဉပမာ ApiClient class တစ်ခုရဲ့ constructor မှာ $endpoint နဲ့ $apiKey လိုတယ်ဆိုရင် config ထဲက ဘယ် key တွေကို pass လိုက်ပါဆိုပြီး သတ်မှတ်တာကို ဆိုလိုတာပါ။

```php
$this->app->bind('api-client', function () {
    return new ApiClient('https://example.com', 'example-key');
});
```

ဒါဆိုရင် **'api-client'** ကို resolve လုပ်ရင် ApiClient ရဲ့ constructor မှာ `https://example.com` နဲ့ `example-key` ကို laravel က pass ပေးသွားမှာပါ။ တကယ့် real world project မှာတော့ အပေါ်က code လို ရိုးရိုး မ bind ဘဲ singleton method ကို သုံးပြီး bind ပါတယ်။

```php
$this->app->singleton('api-client', function () {
    return new ApiClient('https://example.com', 'example-key');
});
```

ဘာကွာလဲဆိုရင် singleton method က တစ်ခါပဲ resolve လုပ်ပေးမှာ။ `app('api-client')` ဆိုပြီး object တစ်ခါဆောက်ပြီးရင် နောက်တစ်ခါ နောက်တစ်နေရာမှာ `app('api-client')` လို့ခေါ်လည်း object အသစ်မဆောက်ဘဲ ပထမ ဆောက်ထားတဲ့ object ပဲ return ပြန်မှာပါ။

### Resolving

`app()` ဆိုတာက dependency တွေကို reslove ဖို့သုံးတာပါ။ `app('api-client')` လို့ ခေါ်လိုက်ရင် service container မှာ bind ထားတဲ့အတိုင်း ApiClient ရဲ့ constructor မှာ $endpoint နဲ့ $apiKey pass ပြီး create လုပ််ထားတဲ့ object ကိုရမှာပါ။

## QuizApi Integration

QuizApi ကို object ဆောက်ပြီး ခေါ်သုံးဖို့ အတွက် QuizApiServiceProvider မှာ အခုလိုရေးပါမယ်။

```php
<?php

namespace PyaeSoneAung\QuizApi;

use Illuminate\Support\ServiceProvider;
use PyaeSoneAung\QuizApiClient\QuizApi;

class QuizApiServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../config/quiz-api.php',
            'quiz-api'
        );

        $this->app->singleton(QuizApi::class, function () {
            return new QuizApi(config('quiz-api.api_key'));
        });
    }
}
```

ဒါဆိုရင် `app(QuizApi::class)` လို့ခေါ်ရင် api key ထည့်ပြီးသား QuizApi object ကို ရမှာပါ။ ဒီနေရာမှာ `QuizApi::class` က **"PyaeSoneAung\QuizApiClient\QuizApi"** ဆိုတဲ့ string ကိုဆိုလိုတာပါ။ `app('PyaeSoneAung\QuizApiClient\QuizApi')` လို့ခေါ်လည်း QuizApi object ကိုရမှာပါ။ ဒီနေရာမှာ `QuizApi::class` လို့ သုံးတာက dependency resolve လုပ်တဲ့အချိန် တခြား package တွေနဲ့ နာမည်တူမျိုး မဖြစ်အောင်လို့ပါ။

ဒါပေမဲ့ Laravel ကနေ

```php
use PyaeSoneAung\QuizApiClient\QuizApi;

app(QuizApi::class)->questions()->get();
```

ဆိုပြီး ခေါ်သုံးမှာ မဟုတ်ပါဘူး။​ အခုလို ရှုပ်ထွေးတဲ့ object ဆောက်တာတွေကို Laravel Facade အောက်မှာ hide ပြီး Laravel ကနေ အခုလိုခေါ် သုံးမှာပါ။

```php
use QuizApi;

QuizApi::questions()->get();
```

Facade ကို create လုပ်ဖို့ အတွက် `src/Facades` folder အောက်မှာ `QuizApi.php` ဆိုပြီး file တစ်ခု create လုပ်ပါမယ်။

`QuizApi.php`

```php
<?php

namespace PyaeSoneAung\QuizApi\Facades;

use Illuminate\Support\Facades\Facade;

class QuizApi extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \PyaeSoneAung\QuizApiClient\QuizApi::class;
    }
}
```

`getFacadeAccessor()` function က `app()` ထဲမှာ solve လုပ်မယ့် နာမည်ကို return ပြန်ပေးတာပါ။ ဒီနေရာမှာ **"PyaeSoneAung\QuizApiClient\QuizApi"** string ကို return ပြန်ပေးမှာပါ။

ပြီးရင်တော့ `composer.json` မှာ QuizApi Facade ကို register လုပ်ပါမယ်။

```json
"extra": {
  "laravel": {
    "providers": ["PyaeSoneAung\\QuizApi\\QuizApiServiceProvider"],
    "aliases": {
      "QuizApi": "PyaeSoneAung\\QuizApi\\Facades\\QuizApi"
    }
  }
}
```

ဒါဆိုရင်တော့ `QuizApi::questions()->get()` ဆိုပြီး Laravel app ကနေ ခေါ်သုံးလို့ရပါပြီ။

## Testing

ကျတော်တို့ package အလုပ်လုပ်မလုပ် စမ်းဖို့အတွက် tests တွေရှိဖို့လိုပါတယ်။ Test ရေးဖို့အတွက် `Pest PHP` ကို install လုပ်ပါမယ်။

```bash
composer require pestphp/pest --dev --with-all-dependencies
```

ပြီးရင်တော့

```bash
./vendor/bin/pest --init
```

ဆိုပြီး run ပါမယ်။ ဒါဆိုရင် tests folder နဲ့ phpunit.xml file ကို generate လုပ်သွားပေးမှာပါ။ ဒါဆိုရင်

```bash
./vendor/bin/pest
```

ဆိုပြီး test တွေ run လို့ရပါပြီ။

`tests` folder ထဲမှာ Feature နဲ့ Unit ဆိုပြီး folder ၂ခု ရှိပါတယ်။ Package တွေမှာတော့ Feature သပ်သပ်၊​ Unit သပ်သပ်ဆိုပြီး test တွေရေးတာထက် အပြင်မှာ class တစ်ခု create လုပ်ပြီးရေးတာမျိုးက ပိုများပါတယ်။ Test ရေးဖို့ အတွက် Feature နဲ့ Unit folder နှစ်ခုလုံးကို ဖျက်လိုက်ပါမယ်။ ပြီးရင် `TestCase.php` ရေးဖို့ အတွက် `composer.json` မှာ အခုလိုပြင်ပါမယ်။

```json
"autoload-dev": {
  "psr-4": {
    "PyaeSoneAung\\QuizApi\\Tests\\": "tests"
  }
}
```

`tests` folder ထဲက class တွေက `PyaeSoneAung\QuizApi\Tests` ဆိုတဲ့ namespace အောက်မှာ ရှိတယ်ဆိုပြီး သတ်မှတ်လိုက်လိုက်တာပါ။

`TestCase.php`

```php
<?php

namespace PyaeSoneAung\QuizApi\Tests;

use Illuminate\Support\Facades\Config;
use PyaeSoneAung\QuizApi\QuizApiServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;

class TestCase extends Orchestra
{
    protected function setUp(): void
    {
        parent::setUp();

        Config::set('quiz-api.api_key', 'foo');
    }

    protected function getPackageProviders($app)
    {
        return [
            QuizApiServiceProvider::class,
        ];
    }
}
```

`setUp()` function မှာက testing လုပ်တဲ့ အချိန်မှာသုံးမယ့် api key ကို သတ်မှတ်လိုက်တာပါ။

`getPackageProviders()` function မှာက `QuizApiServiceProvider` ကို testing မှာ bootstrap လုပ်မယ်ဆိုပြီး သတ်မှတ်လိုက်တာပါ။

ပြီးရင် `Pest.php` မှာ အခုလိုရေးပါမယ်။

`Pest.php`

```php
<?php

use PyaeSoneAung\QuizApi\Tests\TestCase;

uses(TestCase::class)->in(__DIR__);
```

`tests` folder အောက်က test တွေကို run ရင် `TestCase` class ကို သုံးမယ်ဆိုပြီး သတ်မှတ်လိုက်တာပါ။ ပြီးရင်တော့ `QuizApiTest.php` ဆိုပြီး file တစ်ခု create လုပ်ပြီး အခုလိုရေးပါမယ်။

`QuizApiTest.php`

```php
<?php

use PyaeSoneAung\QuizApi\Facades\QuizApi;
use PyaeSoneAung\QuizApiClient\QuizApi as QuizApiClient;
use PyaeSoneAung\QuizApiClient\Resources\QuestionResource;

it('can get QuizApi client', function () {
    expect(app(QuizApiClient::class))->toBeInstanceOf(QuizApiClient::class);
});

it('can get question resource', function () {
    expect(QuizApi::questions())->toBeInstanceOf(QuestionResource::class);
});
```

`can get QuizApi client` က ကျတော်ဆို့ `app()` ဆိုပြီး ခေါ်သုံးတဲ့နေရာမှာ QuizApi client object ပြန်ရလားဆိုပြီး စစ်တာပါ။

`can get question resource` က `QuizApi::questions()` ဆိုပြီး facade ကို ခေါ်သုံးလို့ရလားဆိုပြီး စစ်တာပါ။

ဒါဆိုရင်

```bash
./vendor/bin/pest
```

ဆိုပြီး test ကို run ကြည့်လို့ရပါပြီ။

## Continuous Integration

CI အတွက် `.github/workflows/run-tests.yml` ဆိုပြီး file တစ်ခု create လုပ်ပါမယ်။

`run-tests.yml`

```yml
name: run-tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: true
      matrix:
        os: [ubuntu-latest]
        php: [8.2]
        laravel: [10.*]
        stability: [prefer-stable]
        include:
          - laravel: 10.*
            testbench: 8.*
            carbon: ^2.63

    name: P${{ matrix.php }} - L${{ matrix.laravel }} - ${{ matrix.stability }} - ${{ matrix.os }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ matrix.php }}
          extensions: dom, curl, libxml, mbstring, zip, pcntl, pdo, sqlite, pdo_sqlite, bcmath, soap, intl, gd, exif, iconv, imagick, fileinfo
          coverage: none

      - name: Setup problem matchers
        run: |
          echo "::add-matcher::${{ runner.tool_cache }}/php.json"
          echo "::add-matcher::${{ runner.tool_cache }}/phpunit.json"

      - name: Install dependencies
        run: |
          composer require "laravel/framework:${{ matrix.laravel }}" "orchestra/testbench:${{ matrix.testbench }}" "nesbot/carbon:${{ matrix.carbon }}" --no-interaction --no-update
          composer update --${{ matrix.stability }} --prefer-dist --no-interaction

      - name: List Installed Dependencies
        run: composer show -D

      - name: Execute tests
        run: vendor/bin/pest --ci
```

ဒီနေရာမှာ include အပိုင်းကို အနည်းငယ်ရှင်းပြချင်ပါတယ်။

```yml
include:
  - laravel: 10.*
    testbench: 8.*
    carbon: ^2.63
```

Laravel 10 ကို test ရင် testbench ကို version 8.\* ပဲ​ သုံးရမယ်လို့ သတ်မှတ်တာပါ။​ Laravel 9 ဆိုရင် testbench: 7.\*၊ Laravel 11 ဆိုရင် 9.\* ကို သုံးမယ်ဆိုပြီး သတ်မှတ်ဖို့လိုပါတယ်။ အခု စာရေးနေတဲ့ အချိန်မှာတော့ Laravel 11 မထွက်သေးတဲ့ အတွက် Laravel 10 အတွက်ပဲ CI ရေးထားတာပါ။

ဒါဆိုရင် `git init` လုပ်ပြီး GitHub ပေါ်တင်လို့ရပါပြီ။​ `git init` မလုပ်ခင် `.gitignore` ဆိုပြီး file တစ်ခု create လုပ်ပြီး အခုလိုရေးပါမယ်။

```
vendor
composer.lock
```

vendor folder ရယ်၊​ composer.lock ရယ် ကို git ထဲမထည့်ဘူး သတ်မှတ်တာပါ။

```bash
git init
git add .
git commit -m "initial commit"
```

ပြီးရင်တော့ GitHub မှာ repo တစ်ခု create လုပ်ပြီး push ပါမ​ယ်။

![php-package-development-part-2-img-1](/assets/img/blog/php-package-development-part-2-img-1.jpg)

ဒါဆိုရင် GitHub Repo ထဲက Actions tab မှာ အခုလို test တွေ success ဖြစ်နေတာကိုတွေ့မှာပါ။

## Release

GitHub မှာ `v1.0.0` ကို release လုပ်ပြီး [packagist.org](https://packagist.org/) မှာ submit သွားလုပ်ပါမယ်။

![php-package-development-part-2-img-2](/assets/img/blog/php-package-development-part-2-img-2.jpg)

ဒါပြီးရင်တော့

```bash
composer require pyaesoneaung/quiz-api
```

ဆိုပြီးတော့ ကျတော်တို့ package ကို composer ကနေ install လုပ်လို့ရပါပြီ။

Part-3 မှာတော့ package တစ်ခုကို အခုလို အစဆုံးရေးနေတာမျိုး မဟုတ်ဘဲ​ template တွေအသုံးပြုပြီး ဖန်တီးတာရယ်၊ spatie ရဲ့ package development tool package အကြောင်းရယ်၊ documentation အကြောင်းတွေကို ဆက်ပြီး knowledge sharing လုပ်သွားပါမယ်။

Source code ကို [ဒီမှာ](https://github.com/PyaeSoneAungRgn/quiz-api) ကြည့်လို့ရပါတယ်။​ သိချင်တာရှိရင်လည်း မေးလို့ရပါတယ် ခင်ဗျာ။
