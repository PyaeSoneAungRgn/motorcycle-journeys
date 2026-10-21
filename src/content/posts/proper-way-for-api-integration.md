---
title: Proper Way for Api Integration
date: '2022-09-10'
description: >-
  အစကတော့ working-with-data-in-api-integrations ကို သဘောကျလို့ ဘာသာပြန်မလို့ပါ။
  ပိုပြီး စိတ်ဝင်စားဖို့ ကောင်းသွားအောင် တိုက်ရိုက်ဘာသာမပြန်တော့ဘဲ demo game
  project တစ်ခုရေးပြီး api integration လုပ်တာကို knowledge sharing
  လုပ်ချင်ပါတယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Proper Way for Api Integration'
---
အစကတော့ [working-with-data-in-api-integrations](https://laravel-news.com/working-with-data-in-api-integrations) ကို သဘောကျလို့ ဘာသာပြန်မလို့ပါ။ ပိုပြီး စိတ်ဝင်စားဖို့ ကောင်းသွားအောင် တိုက်ရိုက်ဘာသာမပြန်တော့ဘဲ demo game project တစ်ခုရေးပြီး api integration လုပ်တာကို knowledge sharing လုပ်ချင်ပါတယ်။

### Project Overview

- Source Code - [https://github.com/PyaeSoneAungRgn/proper-way-for-api-integration](https://github.com/PyaeSoneAungRgn/proper-way-for-api-integration)

[opentdb.com](https://opentdb.com/) ကနေ random multiple-choice questions တွေဆွဲပြီး အဖြေမှန်ကို choice လုပ်ရမယ့် cli game တစ်ခုရေးသွားပါမယ်။

### Installation

အရင်ဆုံး **quiz-cli** နာမည်နဲ့ Laravel new project တစ်ခုလုပ်ပါမယ်။

```bash
composer create-project laravel/laravel quiz-cli
```

### Create Api Service

Api Service ကို **app/Services/Opentdb** folder မှာ ဆောက်ပါမယ်။

`app/Services/Opentdb/OpentdbService.php`

```php
<?php

namespace App\Services\Opentdb;

class OpentdbService
{
    public function __construct(
        private readonly string $baseUrl,
        private readonly string $apiToken,
    ) {
    }
}

```

PHP 8 ကနေ စပြီး ပါလာတဲ့ **Readonly Property** နဲ့ **named arguments** ကိုသုံးထားပါတယ်။

Api endpoint နဲ့ token ကို `services.php` မှာ အခုလို ထည့်ပါမယ်။

`config/services.php`

```php
'opentdb' => [
    'url' => env('OPENTDB_URL'),
    'token' => env('OPENTDB_TOKEN'),
]
```

Opentdb Service ကို bootstrap လုပ်ဖို့ အတွက် `app/Providers/AppServiceProvider.php` **boot()** function မှာ အခုလို ရေးပါမယ်။

```php
use App\Services\Opentdb\OpentdbService;

public function boot()
{
    $this->app->singleton(
        abstract: OpentdbService::class,
        concrete: fn () => new OpentdbService(
            baseUrl: config('services.opentdb.url'),
            apiToken: config('services.opentdb.token'),
        ),
    );
}
```

ဒါဆိုရင် `app(OpentdbService::class)` လို့ခေါ်တာနဲ့ **OpentdbService** class ရဲ့ dependencies တွေ inject လုပ်ပြီးသား object ကိုရမှာပါ။

အခု api ခေါ်ဖို့ လိုအပ်တဲ့ http client ဆောက်တာနဲ့ api request တွေ send ဖို့ လိုအပ်တဲ့ function တွေကို `app/Services/Concerns` folder မှာ traits အနေနဲ့ ရေးပါမယ်။

`app/Services/Concerns/BuildBaseRequest.php`

```php
<?php

namespace App\Services\Concerns;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

trait BuildBaseRequest
{
    public function buildRequest(): PendingRequest
    {
        return $this->withBaseUrl()
            ->acceptJson()
            ->timeout(
                seconds: 15,
            );
    }

    public function buildRequestWithToken(): PendingRequest
    {
        return $this->withBaseUrl()->timeout(
            seconds: 15,
        )->withToken(
            token: $this->apiToken,
        );
    }

    public function withBaseUrl(): PendingRequest
    {
        return Http::baseUrl(
            url: $this->baseUrl,
        );
    }
}

```

(ဒီနေရာမှာ Opentdb က api token မလိုတဲ့အတွက် **buildRequest** function ကိုပဲ သုံးသွားပါမယ်။ api token လိုအပ်တဲ့ service တွေအတွက် **buildRequestWithToken** လိုမျိုး function မှာ customize လုပ်ပြီး ရေးလို့ရပါတယ်။)

`app/Services/Concerns/CanSendGetRequest.php`

```php
<?php

namespace App\Services\Concerns;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;

trait CanSendGetRequest
{
    public function get(PendingRequest $request, string $url): Response
    {
        return $request->get(
            url: $url,
        );
    }
}
```

`app/Services/Concerns/CanSendPostRequest.php`

```php
<?php

namespace App\Services\Concerns;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;

trait CanSendPostRequest
{
    public function post(PendingRequest $request, string $url, array $payload = []): Response
    {
        return $request->post(
            url: $url,
            data: $payload,
        );
    }
}
```

ပြီးရင် `app/Services/Opentdb/OpentdbService.php` မှာ traits တွေကို ပြန်သုံးပါမယ်။

```php
<?php

namespace App\Services\Opentdb;

use App\Services\Concerns\BuildBaseRequest;
use App\Services\Concerns\CanSendGetRequest;
use App\Services\Concerns\CanSendPostRequest;
use App\Services\Opentdb\Resources\QuestionResource;

class OpentdbService
{
    use BuildBaseRequest;
    use CanSendGetRequest;
    use CanSendPostRequest;

    public function __construct(
        private readonly string $baseUrl,
        private readonly string $apiToken,
    ) {
    }

    public function question(): QuestionResource
    {
        return new QuestionResource(
            service: $this,
        );
    }
}
```

ဒီနေရာမှာ question() function ကိုနည်းနည်း ရှင်းပြချင်ပါတယ်။ Opentdb api မှာ questions နဲ့ categories အတွက် ဆိုပြီး endpoint တွေရှိပါတယ်။ Questions နဲ့ဆိုင်တဲ့ business logic တွေကို QuestionResource ကနေ handle လုပ်မှာပါ။ တခြား endpoint တွေဆိုရင်လည်း သက်ဆိုင်ရာ Resource ကနေ handle လုပ်ပါမယ်။

`app/Services/Opentdb/Resources/QuestionResource.php`

```php
<?php

namespace App\Services\Opentdb\Resources;

use App\Services\Opentdb\OpentdbService;
use Illuminate\Http\Client\Response;

class QuestionResource
{
    public function __construct(
        private readonly OpentdbService $service,
    ) {
    }

    public function list(?int $count = 3): Response
    {
        return $this->service->get(
            request: $this->service->buildRequest(),
            url: "/api.php?amount={$count}",
        );
    }
}
```

ဒါဆိုရင် tinker ကနေ အခုလို api ခေါ်လို့ရပါပြီ။

```php
use App\Services\Opentdb\OpentdbService;

app(OpentdbService::class)->question()->list()->json()
```

```json
{
  "response_code": 0,
  "results": [
    {
      "category": "Entertainment: Video Games",
      "type": "multiple",
      "difficulty": "medium",
      "question": "What happened to Half-Life 2 prior to its release, which resulted in Valve starting over the development of the game?",
      "correct_answer": "The source code got leaked",
      "incorrect_answers": [
        "They weren&#039;t satisfied with the result",
        "The story was not good enough",
        "Way too many bugs to be fixed"
      ]
    },
    {
      "category": "History",
      "type": "multiple",
      "difficulty": "medium",
      "question": "The Korean War started in what year?",
      "correct_answer": "1950",
      "incorrect_answers": ["1945", "1960", "1912"]
    },
    {
      "category": "Entertainment: Video Games",
      "type": "multiple",
      "difficulty": "easy",
      "question": "In Pokemon, the ability Wonder Guard is exclusive to which Pokemon? ",
      "correct_answer": "Shedinja ",
      "incorrect_answers": ["Sableye", "Spiritomb", "Silvally "]
    }
  ]
}
```

### Handle Api Response

ဒီနေရာမှာ api response က array ဖြစ်နေပါတယ်။ ရိုးရှင်းတဲ့ api တွေမှာဆိုရင် ကိစ္စမရှိပေမယ့် complex ဖြစ်တဲ့ api တွေမှာ array ကို handle လုပ်ရတာ code base ကြီးလာတာနဲ့အမျှ ခက်ခဲလာမှာပါ။

အဲ့ဒါကြောင့် api response array ကို handle လုပ်ရလွယ်ကူတဲ့ Data Object ပြောင်းပါမယ်။ Data Object ပြောင်းဖို့ အတွက် Question Data Object တစ်ခုဆောက်ပါမယ်။

`app/Services/Opentdb/DataObjects/Question.php`

```php
<?php

namespace App\Services\Opentdb\DataObjects;

use Illuminate\Support\Arr;

class Question
{
    public function __construct(
        public readonly string $category,
        public readonly string $type,
        public readonly string $difficulty,
        public readonly string $question,
        public readonly string $correctAnswer,
        public readonly array $incorrectAnswers
    ) {
    }

    public function toArray(): array
    {
        return [
            'question' => $this->question,
            'correct_answer' => $this->correctAnswer,
            'answers' => Arr::shuffle([
                ...$this->incorrectAnswers,
                $this->correctAnswer
            ])
        ];
    }
}
```

Opentdb api response က correct answer ကို string နဲ့ တစ်ခုပြန်ပြီး incorrect answers တွေကို array နဲ့ တစ်ခုပြန်ပါတယ်။ Business logic အရ မေးခွန်းရယ်၊ အဖြေမှန်ရယ်၊ အဖြေတွေအားလုံး random ရောထားတာ ရယ်ပဲ လိုတဲ့ အတွက် toArray() function မှာ အခုလိုရေးထားတာပါ။

Data Object ပြီးရင် response array ကနေ object ပြောင်းဖို့ Data Factory တစ်ခုဆောက်ဖို့ လိုပါတယ်။

`app/Services/Opentdb/DataFactories/QuestionFactory.php`

```php
<?php

namespace App\Services\Opentdb\DataFactories;

use App\Services\Opentdb\DataObjects\Question;
use Illuminate\Support\Collection;

class QuestionFactory
{
    public static function collection(array $questions): Collection
    {
        return (new Collection(
            items: $questions,
        ))->map(
            fn ($question): Question =>
            static::new(attributes: $question),
        );
    }

    public static function new(array $attributes): Question
    {
        return (new static)->make(
            attributes: $attributes,
        );
    }

    public function make(array $attributes): Question
    {
        return new Question(
            category: data_get($attributes, 'category'),
            type: data_get($attributes, 'type'),
            difficulty: data_get($attributes, 'difficulty'),
            question: data_get($attributes, 'question'),
            correctAnswer: data_get($attributes, 'correct_answer'),
            incorrectAnswers: data_get($attributes, 'incorrect_answers', []),
        );
    }
}
```

ဒါဆိုရင် အခုလို သုံးလို့ရပါပြီ။

```php
use App\Services\Opentdb\DataFactories\QuestionFactory;
use App\Services\Opentdb\OpentdbService;

$response = app(OpentdbService::class)->question()->list()->json(); // call api
$questions = QuestionFactory::collection($response['results']); // transform array to data object

$questions->first()->toArray();
// result
// [
//     "question" => "When was the original Star Wars: Battlefront II released?",
//     "correct_answer" => "October 31, 2005",
//     "answers" => [
//         "September 9, 2007",
//         "December 18, 2004",
//         "October 31, 2005",
//         "November 21, 2006",
//     ],
// ]
```

### Quiz Game

Quiz game အတွက် command တစ်ခုဆောက်ပါမယ်။

```bash
php artisan make:command QuizGame
```

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Opentdb\DataFactories\QuestionFactory;
use App\Services\Opentdb\OpentdbService;

class QuizGame extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'quiz:game';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Quiz Game';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $response = app(OpentdbService::class)->question()->list()->json(); // call api
        $questions = QuestionFactory::collection($response['results']); // transform array to data object

        $randomQuestion = $questions->random()->toArray();
        $ans = $this->choice(
            $randomQuestion['question'],
            $randomQuestion['answers']
        );
        if ($ans == $randomQuestion['correct_answer']) {
            $this->info('Correct!');
        } else {
            $this->error('Incorrect!');
        }
    }
}
```

`.env` မှာ Opentdb ကို setup လုပ်ပါမယ်။

```
OPENTDB_URL=https://opentdb.com
OPENTDB_TOKEN=
```

ဒါဆိုရင် `php artisan quiz:game` ဆိုပြီး game ကို စဆော့လို့ ရပါပြီ။

For Correct
![Screen Shot 2022-09-10 at 21.53.27.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662823809347/d_CWbuiSL.png)

For Incorrect
![Screen Shot 2022-09-10 at 21.53.50.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1662823829525/nJdroEMdx.png)
