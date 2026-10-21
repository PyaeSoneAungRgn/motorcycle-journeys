---
title: Build AI Agent in Laravel
date: '2025-05-13'
description: Laravel မှာ AI agent တစ်ခု ဖန်တီးပါမယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Build AI Agent in Laravel'
---
`inspector-apm/neuron-ai` package ကို အသုံးပြုပြီး AI agent တစ်ခုကို အလွယ်လေးဖန်တီးပါမယ်။ နမူနာ အနေနဲ့ Chess Agent တစ်ခုကို ဖန်တီးပါမယ်။ Chess.com ရဲ့ username ပေးပြီး ဘယ် chess opening အသုံးများလဲ၊ win rate ဘယ်လောက်ရှိလဲ စတဲ့ သိချင်တာတွေကို AI ကို မေးပါမယ်။ အခုလို AI agent ကို တိတိကျကျမေးဖို့အတွက် chess.com ရဲ့ api ကို ခေါ်ပြီး data ယူပေးမယ့် tool တစ်ခုပါ ဖန်တီးပါမယ်။

### Installation

အရင်ဆုံး Laravel project တစ်ခုယူပါမယ် ပြီးရင်

```bash
composer require inspector-apm/neuron-ai
```

ဆိုပြီး run ပါမယ်။


### Create Chess Agent

`app/Agents/ChessAgent.php` ဆိုပြီး file တစ်ခုဆောက်ပါမယ်။

```php
<?php

namespace App\Agents;

use App\Tools\GetPlayerProfileTool;
use NeuronAI\Agent;
use NeuronAI\Chat\History\InMemoryChatHistory;
use NeuronAI\Providers\AIProviderInterface;
use NeuronAI\Providers\Gemini\Gemini;
use NeuronAI\SystemPrompt;
use NeuronAI\Tools\Tool;
use NeuronAI\Tools\ToolProperty;

class ChessAgent extends Agent
{
    protected function provider(): AIProviderInterface
    {
        return new Gemini(
            key: 'your-api-key',
            model: 'gemini-2.0-flash-lite',
        );
    }

    public function instructions(): string
    {
        return new SystemPrompt(
            background: [
                'You are an AI agent specializing in analyzing chess games',
            ],
            steps: [
                'Check if the user has provided a username. If not, prompt them to enter one.',
                'Call the "get_player_name" tool to retrieve the player\'s profile and recent games.',
                'Analyze the player\'s game history, performance, and openings used.',
            ],
            output: [
                'Respond to the user with a well-written paragraph summarizing the player\'s profile and recent games.',
                'Only include a profile summary if the user did not ask a specific question.',
                'Convert Unix timestamps (e.g., 1746541293) to human-readable date and time formats:',
                '- Use the player\'s country (from profile data) to determine their local timezone.',
                '- Display time in 12-hour format (e.g., 02:15 PM) instead of 24-hour format.',
                'If data retrieval fails (e.g., player not found), return a clear, user-friendly error message explaining the issue and offering suggestions (e.g., check for typos, try a different username, or try again later).',
                'Note: The `eco` field in game data refers to the opening code used in the game.',
            ]
        );
    }

    protected function tools(): array
    {
        return [
            Tool::make(
                'get_player_name',
                'Retrieve a player\'s profile and recent games for analysis.',
            )->addProperty(
                new ToolProperty(
                    name: 'playerName',
                    type: 'string',
                    description: 'The player name',
                    required: true
                )
            )->setCallable(new GetPlayerProfileTool),
        ];
    }

    protected function chatHistory(): InMemoryChatHistory
    {
        return new InMemoryChatHistory(
            contextWindow: 50000
        );
    }
}

```

ဒီနေရာမှာ `provider()` က ကိုယ်သုံးမယ့် AI Model ထည့်ပေးရမှာပါ။ Anthropic၊ OpenAI၊ Ollama၊ Gemini နဲ့ OpenAI compatible ဖြစ်တဲ့ provider တွေ ကြိုက်တာသုံးလို့ရပါတယ်။ ကျတော်ကတော့ Gemini ပဲ နမူနာ သုံးပြသွားပါမယ်။

`instructions()` ကတော့ ကြည့်တာနဲ့ သိမှာပါ။ AI ကို ကိုယ်ဘာတွေ လုပ်စေချင်လဲ ဘာတွေ output ပြချင်လဲ ဆိုတာ သတ်မှတ်ထားတာပါ။

`chatHistory()` က သူနဲ့ ရှေ့ကပြောတဲ့ conversation တွေကို မှတ်မိစေချင်လို့ပါ။

`tools()` က AI ကခေါ်သုံးလို့ရမယ် tool list ပါ။ လက်ရှိမှာ tool တစ်ခုပဲပါတယ်။ သူက user ပို့တဲ့ စာထဲက playerName ကို ယူပြီး chess data ကို return ပြန်ပေးမှာပါ။ `GetPlayerProfileTool` က ရလာတဲ့ player name နဲ့ chess.com ကနေ data သွားယူဖို့ ရေးထားတဲ့ class ပါ။

`app/Tools/GetPlayerProfileTool.php`

```php
<?php

namespace App\Tools;

use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GetPlayerProfileTool
{
    public function __invoke(string $playerName): array
    {
        return Cache::remember("player_profile_{$playerName}", now()->addMinute(), function () use ($playerName) {
            $currentMonth = now()->format('Y/m');
            $previousMonth = now()->subMonth()->format('Y/m');

            [$profileResponse, $statsResponse, $currentMonthResponse, $previousMonthResponse] = Http::pool(function (Pool $pool) use ($playerName, $currentMonth, $previousMonth) {
                return [
                    $pool->get("https://api.chess.com/pub/player/{$playerName}"),
                    $pool->get("https://api.chess.com/pub/player/{$playerName}/stats"),
                    $pool->get("https://api.chess.com/pub/player/{$playerName}/games/{$currentMonth}"),
                    $pool->get("https://api.chess.com/pub/player/{$playerName}/games/{$previousMonth}"),
                ];
            });

            return [
                'profile' => $profileResponse->json(),
                'stats' => $statsResponse->json(),
                'games' => [
                    'current_month' => $currentMonthResponse->json(),
                    'previous_month' => $previousMonthResponse->json(),
                ],
            ];
        });
    }
}

```

ဒါကတော့ ရိုးရိုးလေးပါ AI Agent ကရတဲ့ player name နဲ့ chess.com က data တွေ သွားခေါ်တာပါ။ `Cache::remember` က api ကို တစ်ခါခေါ်ပြီးရင် နောက်တစ်မိနစ်အတွင်း ထပ်မခေါ်စေချင်လို့ပါ။ `Http::pool` ကို သုံးထားတာက API ၄ခု လုံးကို တပြိုင်ထဲခေါ်ချင်လို့ပါ။ 

ဒါဆိုရင် Chess Agent ကို အခုလိုခေါ်သုံးလို့ ရပါပြီ။

```php
use App\Agents\ChessAgent;
use NeuronAI\Chat\Messages\UserMessage;

$response = ChessAgent::make()
    ->chat(new UserMessage('JaPoe99 is my username and which three chess opening that I mostly used'))
    ->getContent();
```

### Create Chess Agent Command

ပိုပြီး proper ဖြစ်သွားအောင် Laravel Command တစ်ခုဖန်တီးပါမယ်။

```bash
php artisan make:command ChessAgentCommand
```

```php
<?php

namespace App\Console\Commands;

use App\Agents\ChessAgent;
use Illuminate\Console\Command;
use NeuronAI\Chat\Messages\UserMessage;

use function Laravel\Prompts\info;
use function Laravel\Prompts\spin;
use function Laravel\Prompts\text;

class ChessAgentCommand extends Command
{
    protected $signature = 'chess:agent';

    protected $description = 'Chess Agent Command';

    public function handle()
    {
        $agent = ChessAgent::make();

        info('Welcome to the Chess Agent!');

        while (true) {
            $question = text('');

            $response = spin(
                message: 'Thinking...',
                callback: fn () => $agent->chat(
                    new UserMessage($question)
                )
            );

            info($response->getContent());
        }
    }
}
```

ဒါဆိုရင် အခုလိုသုံးလို့ရပါပြီ။

<video playsinline preload="metadata" width="100%" height="auto" controls>
  <source src="/assets/img/blog/build-ai-agent-in-laravel-mov-1.mp4" type="video/mp4">
</video>


### Neuron AI

[Neuron AI](https://docs.neuron-ai.dev/) က PHP မှာ AI Agent ဖန်တီးဖို့အတွက် feature စုံတဲ့ composer package တစ်ခုပါ။ သူ့မှာ RAG တို့ MCP တို့နဲ့ ချိတ်တာတို့ လည်းရှိပါသေးတယ် အသေးစိတ်ကို official documentation နဲ့ [https://inspector.dev/blog/](https://inspector.dev/blog/) မှာ လေ့လာလို့ရပါတယ်။
