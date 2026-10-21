---
title: PHP Package Development (Part-1)
date: '2023-12-15'
description: >-
  PHP နဲ့ Laravel Package တွေ ဖန်တီးတာကို knowledge sharing လုပ်ချင်ပါတယ်။
  ဒီအပိုင်းမှာတော့ PHP အတွက် package တစ်ခုဖန်တီးပါမယ်။
image: 'https://og.pyaesoneaung.dev/og?title=PHP Package Development (Part-1)'
---
PHP နဲ့ Laravel Package တွေ ဖန်တီးတာကို knowledge sharing လုပ်ချင်ပါတယ်။ ဒီအပိုင်းမှာတော့ PHP အတွက် package တစ်ခုဖန်တီးပါမယ်။

## Quiz Api Client

Quiz Api က linux တို့၊ docker တို့၊ php တို့ စတဲ့ tech နဲ့ ပတ်သတ်တာတွေကို muliple choice question တွေထုတ်ပေးတဲ့ api တစ်ခုပါ။​ [https://quizapi.io/](https://quizapi.io/) မှာ အကောင့်ဖွင့်ပြီး api token တစ်ခု create လုပ်ဖို့လိုပါတယ်။

## Setup Composer Project

Project တစ်ခု create လုပ်ဖို့အတွက်

```bash
mkdir quiz-api-client
cd quiz-api-client
composer init
```

ဆိုပြီး run ပါမယ်။

```
Package name (<vendor>/<name>) [pyaesoneaung/quiz-api-client]:
```

Package name ကို `pyaesoneaung/quiz-api-client` ဆိုပြီး ထည့်ပါမယ်။ vendor မှာထည့်တာက vendor folder ကိုဖွင့်လိုက်ရင် စစတွေ့မယ့် folder name ပါ။ အများအားဖြင့် author နာမည်ကိုပဲထည့်ပါတယ်။​ name မှာထည့်တာက package name ပါ။

```
Description []:
```

Description က ကိုယ်ကြိုက်တာထည့်လို့ရပါတယ်။

```
Author [Pyae Sone Aung <pyaesoneaung.code@gmail.com>, n to skip]:
```

Author ကလည်း သူပေးတဲ့ format နဲ့ ကြိုက်တာထည့်လို့ရပါတယ်။ ဘာမှမထည့်ချင်ရင် `n` နဲ့ skip လို့ရပါတယ်။

```
Minimum Stability []:
```

Minimum Stability က လိုအပ်တဲ့ dependency တွေကို ဘယ် version တွေ သွင်းမလဲဆိုတာ သတ်မှတ်တာပါ။ ဒီနေရာမှာ `dev` လို့ထည့်ပါမယ်။

```
Package Type (e.g. library, project, metapackage, composer-plugin) []:
```

ဒီနေရာမှာ `library` လို့ပဲထည့်ရပါမယ်။

```
License []:
```

License အကြောင်းတွေသိရင် ထည့်လိုက်ပါ။ မသိရင် ကျော်သွားလို့ရပါတယ်။

```
Define your dependencies.

Would you like to define your dependencies (require) interactively [yes]?
```

no ဆိုပြီး ကျော်သွားလိုက်ပါ။

```
Would you like to define your dev dependencies (require-dev) interactively [yes]?
```

no ဆိုပြီး ကျော်သွားလိုက်ပါ။

```
Add PSR-4 autoload mapping? Maps namespace "Pyaesoneaung\QuizApiClient" to the entered relative path. [src/, n to skip]:
```

enter နှိပ်ပေးလိုက်ပါ။

```
Do you confirm generation [yes]?
```

enter နှိပ်ပေးလိုက်ပါ။

အဲ့ဒါဆိုရင် အခုလို folder structure ရပါပြီ။

```
├── src
├── vendor
└── composer.json
```

composer.json မှာ အခုလိုပြင်ပါမယ်။

```diff
{
    "name": "pyaesoneaung/quiz-api-client",
    "description": "Quiz Api Client",
    "type": "library",
    "license": "MIT",
    "autoload": {
        "psr-4": {
-           "Pyaesoneaung\\QuizApiClient\\": "src/"
+           "PyaeSoneAung\\QuizApiClient\\": "src/"
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

**"prefer-stable": true** က **"minimum-stability": "dev"** ဖြစ်နေရင်တောင်မှပဲ dependency တွေထဲက stable အဖြစ်ဆုံး version ကိုပဲ ဉီးစားပေးသွင်းမယ်ဆိုလိုတာပါ။

**"PyaeSoneAung\\QuizApiClient\\": "src/"** အဲ့အပိုင်းက ကျတော်တို့ src အောက်မှာ အသစ်ရေးမယ့် class တွေက **"PyaeSoneAung\QuizApiClient\"** namespace အောက်ကသွားမယ်လို့သတ်မှတ်လိုက်တာပါ။

ဘာမှမရေးခင် အရင်ဆုံး ကိုယ့် package က PHP version ဘယ်လောက်အနိမ့်ဆုံးလိုမယ်ဆိုတာ သတ်မှတ်ဖို့လိုပါတယ်။ ကိုယ်က modern syntax တွေသုံးချင်ရင် php-8.1 လောက်ကစသင့်ပါတယ်။

```bash
composer require php:^8.1
```

ဒါဆိုရင် composer.json မှာ

```json
"require": {
    "php": "^8.1"
}
```

ဆိုပြီးတိုးသွားမှာပါ။ ဒီနေရာမှာ **^** လေးက 8.1 အထက်လို့ဆိုလိုတာ ကိုယ့်စက်မှာ php-8.2 သုံးနေရင်လည်း အဆင်ပြေမှာပါ။ တကယ်လို့ ကိုယ့်စက်က php-8.0 (သို့) php-7.2 ဖြစ်နေရင် သွင်းရမှာမဟုတ်ဘူး။ အဲ့ကျရင် အခုလိုပြင်ရေးဖို့လိုပါတယ်။

```json
"require": {
    "php": "^7.2|^8.0"
}
```

`>=7.2` ဆိုလည်းရပါတယ်။ ကျတော်ကတော့ အဲ့လိုပေးတာ သိပ်သဘောမကျပါဘူး။ အဲ့လိုပေးလိုက်ရင် php-9.\* ထွက်ခဲ့ရင်လည်း သွင်းလို့ရနေမှာ။ ကိုယ့် package က php-9.\* မှာ support ပေးမပေးဆိုတာက ကြိုမသိနိုင်လို့ php-9.\* ထွက်ခဲ့ရင် ကိုယ်တိုင် test လုပ်ပြီးမှ **"php": "^7.2|^8.0|^9.0"** ဆိုပြီး ထပ်ထည့်ပြီး version တစ်ခု release လုပ်တာက ပိုကောင်းပါတယ်။

PHP သွင်းပြီးသွားရင်တော့ Quiz api ခေါ်ဖို့ အတွက် [Guzzle](https://docs.guzzlephp.org/en/stable/index.html) ကို သွင်းပါမယ်။

```bash
composer require guzzlehttp/guzzle:^7.0
```

ဒါဆိုရင် composer.json ရဲ့ require block မှာ အခုလိုတိုးသွားမှာပါ။

```json
"require": {
    "php": "^8.1",
    "guzzlehttp/guzzle": "^7.0"
}
```

## Api Integration

Quiz Api ကို integrate လုပ်ဖို့ အခုလိုရေးပါမယ်။

```
├── src
│   ├── Concerns
│   │   ├── BuildBaseClient.php
│   │   ├── CanSendGetRequest.php
│   ├── Resources
│   │   ├── QuestionResource.php
│   ├── QuizApi.php
├── vendor
└── composer.json
```

`src/Concerns/BuildBaseClient.php`

```php
<?php

namespace PyaeSoneAung\QuizApiClient\Concerns;

use GuzzleHttp\Client;

trait BuildBaseClient
{
    public function buildClient(): Client
    {
        return new Client([
            'base_uri' => 'https://quizapi.io',
            'headers' => [
                'X-Api-Key' => $this->apiKey,
            ],
        ]);
    }
}
```

`src/Concerns/CanSendGetRequest.php`

```php
<?php

namespace PyaeSoneAung\QuizApiClient\Concerns;

use GuzzleHttp\Client;
use Psr\Http\Message\ResponseInterface;

trait CanSendGetRequest
{
    public function get(Client $apiClient, string $url): ResponseInterface
    {
        return $apiClient->request('GET', $url);
    }
}
```

`src/Resources/QuestionResource.php`

```php
<?php

namespace PyaeSoneAung\QuizApiClient\Resources;

use Pyaesoneaung\QuizApiClient\QuizApi;

class QuestionResource
{
    public function __construct(
        private readonly QuizApi $service,
    ) {
    }

    public function get(): array
    {
        $body = $this->service->get(
            apiClient: $this->service->buildClient(),
            url: '/api/v1/questions',
        )->getBody();

        return json_decode($body, true);
    }
}
```

`src/QuizApi.php`

```php
<?php

namespace PyaeSoneAung\QuizApiClient;

use PyaeSoneAung\QuizApiClient\Concerns\BuildBaseClient;
use PyaeSoneAung\QuizApiClient\Concerns\CanSendGetRequest;
use PyaeSoneAung\QuizApiClient\Resources\QuestionResource;

class QuizApi
{
    use BuildBaseClient;
    use CanSendGetRequest;

    public function __construct(
        private readonly string $apiKey
    ) {
    }

    public function questions(): QuestionResource
    {
        return new QuestionResource(
            service: $this
        );
    }
}
```

ကျတော် အရင်ကရေးဖူးတဲ့ [Proper Way for Api Integration](/posts/proper-way-for-api-integration) ထဲက ပုံစံအတိုင်းရေးထားတာပါ။ အသေးစိတ်ကို အဲ့မှာ ဖတ်လို့ရပါတယ်။

​ဒါဆိုရင် Quiz api ကို ဒီလိုခေါ်လို့ရပါပြီ။

```php
use PyaeSoneAung\QuizApiClient\QuizApi;

(new QuizApi($apiKey))->questions()->get();
```

ဒီလို syntax နဲ့ api ခေါ်ချင်လို့ အပေါ်ကလိုမျိုးရေးထားတာပါ။ Laravel ရေးနေကျဆိုရင် ဒီ syntax ကို မြင်တာနဲ့ QuizApi ကနေ question တွေအကုန် သွားခေါ်တယ်ဆိုတာ အလိုလိုခံစားမိမှာပါ။

ရေးပြီးတဲ့ code တွေ အလုပ်လုပ်မလုပ် စမ်းဖို့အတွက် root folder မှာပဲ `playground.php` ဆိုပြီး file တစ်ခု create လုပ်ပါမယ်။

`playground.php`

```php
<?php

require __DIR__.'/vendor/autoload.php';

use PyaeSoneAung\QuizApiClient\QuizApi;

$apiKey = 'real-api-key-here';
$data = (new QuizApi($apiKey))->questions()->get();
var_dump($data);
```

ပြီးရင်တော့ terminal ကနေ playground.php ကို run ပါမယ်။

```bash
php playground.php
```

ဒါဆိုရင် `$data` မှာ QuizApi ရဲ့ response array ဆိုရမှာပါ။

`require __DIR__.'/vendor/autoload.php';` က ကျတော်တို့ `composer.json` မှာ သတ်မှတ်ထားတဲ့ Namespace ကို resolve လုပ်တာတို့၊​ vendor folder ထဲက package တွေကို သုံးလို့ရအောင်တို့ကို လုပ်ပေးတာပါ။

## Testing

ကျတော်တို့ package အလုပ်လုပ်မလုပ် စမ်းဖို့အတွက် tests တွေရှိဖို့လိုပါတယ်။ Test ရေးဖို့အတွက် `Pest PHP` ကို install လုပ်ပါမယ်။

```bash
composer require pestphp/pest --dev --with-all-dependencies
```

ဒီနေရာမှာ `--dev` က development လုပ်တဲ့အချိန်မှာပဲ သွင်းဖို့လိုတယ်လို့ ဆိုလိုတာပါ။ Package ကို release လုပ်ပြီးလို့ သူများတွေ install လုပ်တဲ့အချိန်မှာဆို `guzzlehttp/guzzle` ကိုပဲ dependency အနေနဲ့ သွင်းသွားမှာပါ။

ပြီးရင်တော့

```bash
./vendor/bin/pest --init
```

ဆိုပြီး run ပါမယ်။ ဒါဆိုရင် `tests` folder နဲ့ `phpunit.xml` file ကို generate လုပ်သွားပေးမှာပါ။ ဒါဆိုရင်

```bash
./vendor/bin/pest
```

ဆိုပြီး test တွေ run လို့ရပါပြီ။

`tests` folder ထဲမှာ Feature နဲ့ Unit ဆိုပြီး folder ၂ခု ရှိပါတယ်။ Package တွေမှာတော့ Feature သပ်သပ်၊​ Unit သပ်သပ်ဆိုပြီး test တွေရေးတာထက် အပြင်မှာ class တစ်ခု create လုပ်ပြီးရေးတာမျိုးက ပိုများပါတယ်။ Test ရေးဖို့ အတွက် Feature နဲ့ Unit folder နှစ်ခုလုံးကို ဖျက်လိုက်ပါမယ်။ ပြီးရင် `Pest.php` မှာ အခုလိုပြင်ပါမယ်။

```php
<?php

use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use PyaeSoneAung\QuizApiClient\QuizApi;

function quizApi()
{
    return new QuizApi('foo');
}

function mockClient()
{
    $mock = new MockHandler([
        new Response(status: 200, body: json_encode(['foo' => 'bar'])),
    ]);
    $handlerStack = HandlerStack::create($mock);

    return new Client(['handler' => $handlerStack]);
}
```

`Pest.php` မှာ ရေးတဲ့ helper function တွေကို test ရဲ့ ကြိုက်တဲ့နေရာက ခေါ်သုံးလို့ရပါတယ်။

`quizApi()` ကိုခေါ်ရင် `QuizApi` object return ပြန်မှာပါ။ ဒီနေရာမှာ api key ထည့်ဖို့မလိုပါဘူး။ ကျတော်တို့ code က Quiz Api ကို api သွားခေါ်နိုင်လားဆိုတာပဲ​ test ဖို့လိုတာပါ။ Quiz Api ကို key အစစ်ထည့်ပြီး တကယ်သွားခေါ်ဖို့ မလိုပါဘူး။ ဉပမာ တခြား developer တစ်ယောက် ဒီ code တွေ အလုပ်လုပ်မလုပ် စမ်းဖို့အတွက် သူကိုယ်တိုင် အကောင့်ဖွင့်ပြီး api token ယူပြီး စမ်းနေဖို့မလိုပါဘူး။

`mockClient()` က guzzle client ကို mock လုပ်ဖို့ပါ။ mock လုပ်ထားတဲ့ client ကိုသုံးရင် api တကယ်သွားမခေါ်ဘဲ 200 response ကို ပြန်ရမှာပါ။ အဲ့အတွက် `MockHandler` ကို create လုပ်ပြီး `Client` မှာ pass ပေးထားတာပါ။

ပြီးရင်တော့ tests folder မှာပဲ​ `QuizApiTest.php` ဆိုပြီး class တစ်ခု create လုပ်ပါမယ်။

`tests/QuizApiTest.php`

```php
<?php

use GuzzleHttp\Client;
use Psr\Http\Message\ResponseInterface;
use PyaeSoneAung\QuizApiClient\Resources\QuestionResource;

it('can build client', function () {
    expect(quizApi()->buildClient())->toBeInstanceOf(Client::class);
});

it('can send get request', function () {
    expect(quizApi()->get(mockClient(), '/foo'))->toBeInstanceOf(ResponseInterface::class);
});

it('can return QuestionResource', function () {
    expect(quizApi()->questions())->toBeInstanceOf(QuestionResource::class);
});
```

`can build client` က `buildClient` function က guzzle client ကို create လုပ်နိုင်လား test တာပါ။ `toBeInstanceOf()` က `expect` ရဲ့ return ပြန်တဲ့ class က toBeInstanceOf() မှာထည့်ထားတဲ့ calss ဖြစ်ရမယ်လိုဆိုလိုတာပါ။

`can send get request` က GET method နဲ့ api ခေါ်လို့ရလား test တာပါ။ `get()` အတွက်လိုအပ်တဲ့ api client နေရာမှာ `mockClient()` ကိုသုံးထားပါတယ်။

`can return QuestionResource` ဒီဟာကတော့ရှင်းပါတယ်။ `quizApi()->questions()` လို့ခေါ်ရင် QuestionResource ရမရစစ်တာပါ။

`QuizApiTest.php` ထဲက test တွေက `BuildBaseClient.php`၊ `CanSendGetRequest.php` နဲ့ `QuizApi.php` ထဲက function တွေအကုန် cover ဖြစ်ပါပြီ။

```bash
./vendor/bin/pest
```

ဆိုပြီး test ကို run ကြည့်လို့ရပါပြီ။

![php-package-development-part-1-img-1](/assets/img/blog/php-package-development-part-1-img-1.png)

ပြီးရင်တော့ ကျန်နေသေးတဲ့ `QuestionResource` class အတွက် test ရေးဖို့ package တစ်ခုသွင်းဖို့လိုပါတယ်။

```bash
composer require mockery/mockery --dev
```

ပြီးရင်တော့ `tests/Resources/QuestionResourceTest.php` ဆိုပြီး class တစ်ခု create လုပ်ပါမယ်။

`QuestionResourceTest.php`

```php
<?php

use PyaeSoneAung\QuizApiClient\QuizApi;
use PyaeSoneAung\QuizApiClient\Resources\QuestionResource;

it('can get questions', function () {
    $client = Mockery::mock(QuizApi::class);
    $client->shouldReceive('buildClient')->andReturnUsing(
        fn () => mockClient()
    );
    $client->shouldReceive('get')->andReturnUsing(
        fn () => mockClient()->get('/foo')
    );

    expect((new QuestionResource($client))->get())->toBeArray();
});
```

`can get questions` မှာ mockery package က `Mockery::mock()` ကို သုံးပြီး client တစ်ခု create လုပ်ပါတယ်။ ဒီနေရာမှာ `QuizApi::class` က `"PyaeSoneAung\QuizApiClient\QuizApi"` string ဖြစ်ပါတယ်။ ဒီနေရာမှာ ကိုယ်ကြိုက်တဲ့ string passs လို့ရပါတယ်။ mock name ကို unique ဖြစ်အောင်လို့နဲ့ `QuizApi` class ကို mock လုပ်မှန်းသိသာအောင် `Mockery::mock(QuizApi::class)` ဆိုပြီးသုံးထားတာပါ။

```php
$client->shouldReceive('buildClient')->andReturnUsing(
    fn () => mockClient()
);
```

shouldReceive က mock လုပ်ထားတဲ့ `$client` မှာ `buildClient` function ရှိတယ်လို့ သတ်မှတ်တာပါ။​ `andReturnUsing()` အဲ့ function ကိုခေါ်ရင် mock လုပ်ထားတဲ့ guzzle client return ပြန်မယ်လို့ သတ်မှတ်တာပါ။

```php
$client->shouldReceive('get')->andReturnUsing(
    fn () => mockClient()->get('/foo')
);
```

ဒီဟာလဲ အပေါ်ကသဘောပါပဲ။

```php
expect((new QuestionResource($client))->get())->toBeArray();
```

`(new QuestionResource($client))->get()` ကို ခေါ်ရင် return ပြန်တာက array ဖြစ်ရမယ်လို့ ဆိုလိုတာပါ။

```bash
./vendor/bin/pest
```

ဆိုပြီး test ကို run ကြည့်လို့ရပါပြီ။

![php-package-development-part-1-img-2](/assets/img/blog/php-package-development-part-1-img-2.png)

## Continuous Integration

CI ဆိုတာကတော့ ကျတော်တို့ code တွေမှာ changes တွေဖြစ်တိုင်း build လုပ်တာတွေ၊ tests run တာတွေကို auto လုပ်ပေးတာပါ။ ဒီနေရာမှာ CI platform တစ်ခုဖြစ်တဲ့ [GitHub Actions](https://github.com/features/actions) ကိုသုံးပြီး tests တွေကို auto run အောင် setup လုပ်ပါမယ်။

အဲ့အတွက် `.github/workflows/run-tests.yml` ဆိုပြီး file တစ်ခု create လုပ်ပါမယ်။

`run-tests.yml`

```yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: true
      matrix:
        os: [ubuntu-latest]
        php: [8.1, 8.2, 8.3]

    name: P${{ matrix.php }} - ${{ matrix.os }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ matrix.php }}
          coverage: none

      - name: Install dependencies
        run: composer install --prefer-dist --no-interaction --optimize-autoloader

      - name: Execute tests
        run: ./vendor/bin/pest
```

အဲ့ထဲက အရေးကြီးတာ တစ်ချို့ကို ရှင်းပြချင်ပါတယ်။

```yml
runs-on: ${{ matrix.os }}
  strategy:
    fail-fast: true
    matrix:
      os: [ubuntu-latest]
      php: [8.1, 8.2, 8.3]

  name: P${{ matrix.php }} - ${{ matrix.os }}
```

သူက ubuntu latest version မှာ php-8.1 က နေ 8.3 ထိ tests ၃မျိုး run မယ်လို့ သတ်မှတ်တာပါ။ တကယ်လို့ windows latest version မှာ run ချင်ရင် `os: [ubuntu-latest, windows-latest]` ဆိုပြီး ပြင်ရေးလို့ရပါတယ်။ အဲ့တာဆိုရင် `php-8.1 - ubuntu` `php-8.2 - ubuntu` `php-8.3 - ubuntu` `php-8.1 - windows` `php-8.2 - windows` `php-8.3 - windows` အဲ့လို tests ၆မျိုး run သွားမှာပါ။ ကျတော်ကတော့ windows ကို ထည့်မရေးပါဘူး test လုပ်ရင် ကြာလို့ပါ။​

ဒါဆိုရင် `git init` လုပ်ပြီး github ပေါ်တင်လို့ရပါပြီ။​ `git init` မလုပ်ခင် `.gitignore` ဆိုပြီး file တစ်ခု create လုပ်ပြီး အခုလိုရေးပါမယ်။

```
vendor
composer.lock
playground.php
```

vendor folder ရယ်၊​ composer.lock ရယ်၊​ playground.php file ကို git ထဲမထည့်ဘူး သတ်မှတ်တာပါ။ ဒီနေရာမှာ `playground.php` မှာ တကယ့် api key အစစ်ကို ထည့်ပြီး စမ်းထားတာရှိပါတယ်။ အဲ့လို key တွေ ထည့်ပြီးစမ်းတဲ့ file မျိုးကို git ထဲ မထည့်မိဖို့က အရမ်းအရေးကြီးပါတယ်။

```bash
git init
git add .
git commit -m "initial commit"
```

ပြီးရင်တော့ GitHub မှာ repo တစ်ခု create လုပ်ပြီး push ပါမ​ယ်။

![php-package-development-part-1-img-3](/assets/img/blog/php-package-development-part-1-img-3.png)

ဒါဆိုရင် GitHub Repo ထဲက Actions tab မှာ အခုလို test တွေ success ဖြစ်နေတာကိုတွေ့မှာပါ။

## Release

Release လုပ်ဖို့အတွက် GitHub ကိုသွားပြီး အခုလိုလုပ်ပါမယ်။

![php-package-development-part-1-img-4](/assets/img/blog/php-package-development-part-1-img-4.png)

`0 tags` ကို နှိပ်ပါမယ်။

![php-package-development-part-1-img-5](/assets/img/blog/php-package-development-part-1-img-5.png)

`Create a new release`

![php-package-development-part-1-img-6](/assets/img/blog/php-package-development-part-1-img-6.png)

Choose a tag မှာ `v1.0.0` ဆိုပြီး tag တစ်ခု create လုပ်ပါမယ်။ Title နဲ့ description မှာ အဆင်ပြေတာ ရေးလို့ရပါတယ်။

ပြီးရင်တော့ [packagist.org](https://packagist.org/) မှာ submit သွားလုပ်ပါမယ်။

![php-package-development-part-1-img-7](/assets/img/blog/php-package-development-part-1-img-7.png)

ဒါပြီးရင်တော့

```bash
composer require pyaesoneaung/quiz-api-client
```

ဆိုပြီးတော့ ကျတော်တို့ package ကို composer ကနေ install လုပ်လို့ရပါပြီ။

Part-2 မှာတော့ Laravel အတွက် package development ကို ဆက်ပြီး knowledge sharing လုပ်သွားပါမယ်။​ Laravel ဆိုရင်တော့ အခုလို object create လုပ်ပြီး constructor မှာ api key ထည့်တာတွေကို framework level မှာ dependency injection လုပ်ပြီး facades ကနေပဲ အလွယ်တကူ ခေါ်သုံးလို့ရအောင် ဖန်တီးလို့ရပါတယ်။

စာရေးတာ အရမ်းရှည်သွားလို့ တချို့ပြောချင်တာတွေကိုတော့ ချန်ထားခဲ့လိုက်ရပါတယ်။​ Source code ကို [ဒီမှာ](https://github.com/PyaeSoneAungRgn/quiz-api-client) ကြည့်လို့ရပါတယ်။​ သိချင်တာရှိရင်လည်း မေးလို့ရပါတယ် ခင်ဗျာ။
