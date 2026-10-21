---
title: Real-Time Application with Laravel
date: '2024-05-23'
description: Laravel နဲ့ Real-Time application တစ်ခု ဖန်တီးပါမယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Real-Time Application with Laravel'
---
Laravel နဲ့ Real-Time application တစ်ခု ဖန်တီးပါမယ်။

## Project Overview

![real-time-application-with-laravel-img-1](/assets/img/blog/real-time-application-with-laravel-img-1.png)

အစိမ်းကောင်ကို နှိပ်ရင် အစိမ်းရောင် background ပြောင်းပြီး အနီကောင်ကို နှိပ်ရင် အနီရောင် background ပြောင်းမှာပါ။ တစ်ယောက်ယောက်က တစ်ခုခုနှိပ်တာနဲ့ အဲ့ page ကို ဖွင့်ထားတဲ့ device တိုင်းမှာ real time update ဖြစ်သွားမှာပါ။

<video playsinline preload="metadata" width="100%" height="auto" controls>
  <source src="/assets/img/blog/real-time-application-with-laravel-img-2.mp4" type="video/mp4">
</video>

ဒါက ကျတော်စက်မှာ browser ၂ခု နဲ့ စမ်းပြထားတာပါ။

## Frontend

အရင်ဆုံး Laravel project တစ်ခု create လုပ်ပါမယ်။

```bash
composer create-project laravel/laravel real-time-app-with-laravel
```

ပြီးရင်တော့ [Laravel Folio](https://laravel.com/docs/11.x/folio) ကို install လုပ်ပါမယ်။

```bash
composer require laravel/folio
php artisan folio:install
```

Laravel Folio ဆိုတာကတော့ Laravel မှာ frontend ရေးရင် သုံးတဲ့ package တစ်ခုပါ။ `resources/views/pages` folder မှာ `hello.blade.php` ဆိုပြီး create လုပ်ရင် `http://localhost:8000/hello` ဆိုပြီးခေါ်လို့ရမှာပါ။ `hi.blade.php` ဆိုပြီး create လုပ်ရင် `/hi` ဆိုပြီးခေါ်လို့ရမှာပါ။ အလွယ်ပြောရရင် Next.js လိုပါပဲ။

```bash
php artisan folio:page play
```
ဆိုပြီး page တစ်ခု create လုပ်ပါမယ်။ ဒါဆိုရင် `resources/views/pages/play.blade.php` ဆိုပြီး file တစ်ခု create လုပ်သွားမှာပါ။

ပြီးရင်တော့ [Laravel Volt](https://livewire.laravel.com/docs/volt) ကို install လုပ်ပါမယ်။

```bash
composer require livewire/volt
php artisan volt:install
```

Laravel Volt က blade file တစ် file ထဲမှာပဲ​ PHP logic တွေ ရေးဖို့ အတွက်ပါ။

```html
<?php
 
use function Livewire\Volt\{state};

state(['count' => 0]);
$increment = fn () => $this->count++;
 
?>
 
<div>
    <h1>{{ $count }}</h1>
    <button wire:click="increment">+</button>
</div>
```
ဉပမာ Volt နဲ့ ဒါမျိုးရေးလို့ရပါတယ်။ `+` button ကိုနှိပ်ရင် count မှာ ၁ တိုးသွားပါမယ်။

ပြီးရင်တော့ `layout` တစ်ခု create လုပ်ပါမယ်။

```bash
php artisan livewire:layout
```

ဒါဆိုရင် `resources/views/components/layouts/app.blade.php` ဆိုပြီး file တစ်ခု create လုပ်သွားပါမယ်။ အဲ့ file မှာ အခုလိုရေးပါမယ်။

```html
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{{ $title ?? 'Page Title' }}</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body>
    {{ $slot }}
</body>

</html>
```

ပြီးရင်တော့ TailwindCSS ကို install လုပ်ပါမယ်။

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

ပြီးရင် `tailwind.config.js` မှာ အခုလိုပြင်ပါမယ်။

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

ဒါဆိုရင် စောနက create လုပ်ထားတဲ့ `play.blade.php` မှာ ui စရေးလို့ရပါပြီ။

```html
<x-layouts.app title="Play">
    <div id="playground" class="w-full h-screen flex items-center" style="background: rgb(74 222 128)">
        <div class="w-1/2">
            <img class="cursor-pointer w-64 mx-auto" src="/earth_spirit.png"
                alt="radiant">
        </div>
        <div class="w-1/2">
            <img class="cursor-pointer w-64 mx-auto" src="/mars.png" alt="dire">
        </div>
    </div>
</x-layouts.app>
```

`<x-layouts.app title="Play">` x-layouts.app က စောနက create လုပ်ထားတဲ့ `app.blade.php` ကို extend လုပ်ထားတာပါ။

ဒါဆိုရင် `/play` လို့ browser မှာခေါ်လိုက်ရင် ui ကို မြင်ရပါပြီ။

![real-time-application-with-laravel-img-1](/assets/img/blog/real-time-application-with-laravel-img-1.png)

## Backend

Laravel မှာ real-time event တွေကို [Broadcasting](https://laravel.com/docs/11.x/broadcasting#client-side-installation) ကနေ ရေးရပါတယ်။

```bash
php artisan install:broadcasting
```
ဆိုပြီး broadcasting ကို install လုပ်ပါမယ်။​ [Laravel Reverb](https://laravel.com/docs/11.x/reverb) ကို သွင်းမလားမေးရင် `yes` လုပ်ပေးလိုက်ပါ။

Laravel Reverb ဆိုတာကတော့ websocket server တစ်ခုဖြစ်ပါတယ်။ ပြီးတော့ သူ့ကို pusher client တွေနဲ့ ချိတ်သုံးလို့ရပါတယ်။ ဒီနေရာမှာ တစ်ခုသေချာရှင်းလင်းချင်တာက pusher client သုံးတယ်ဆိုတာ pusher ကို ဝယ်သုံးတာမဟုတ်ပါဘူး pusher sdk ကိုပဲသုံးတာတာ host က laravel reverb host ကို သုံးရမှာပါ။ Laravel Reverb ကိုယ်တိုင်က pusher server သဘောပါ။

```
REVERB_APP_ID=286585
REVERB_APP_KEY=ns5vuegxbudmxyrdyfnb
REVERB_APP_SECRET=zdveddmzanu54wsqw7ad
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SCHEME=http
```
ဒီ key တွေကို pusher client မှာထည့်ပြီး Laravel Reverb နဲ့ ချိတ်လို့ရပါတယ်။ ကိုယ်ကြိုက်သလိုလည်း `.env` မှာပြင်လို့ရပါတယ်။ ဒီဟာကို နောက်ဆုံးမှာ pusher js သုံးပြီး pure html နဲ့ ရေးပြပါမယ်။

ပြီးရင်တော့ event တစ်ခု create လုပ်ပါမယ်။

```
php artisan make:event CharacterUpdated
```

ဒါဆိုရင် `app/Events/CharacterUpdated.php` ဆိုပြီး file တစ်ခု create လုပ်သွားပါတယ်။

```php
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CharacterUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly string $character
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('character'),
        ];
    }
}
```

ဒီနေရာမှာ အရေးကြီးတာ ၂ခု ရှိပါတယ်။ `ShouldBroadcast` ကို impletement လုပ်ထားရပါမယ်။ broadcastOn မှာ သုံးထားတဲ့ channel က `Illuminate\Broadcasting\Channel` ဖြစ်ရပါမယ်။ ကျတော်တို့က auth မပါတဲ့ public channel တစ်ခုလုပ်မှာမို့ပါ။ `character` ဆိုတာကတော့ ကျတော်တို့ရဲ့ channel name ပါ။

## Integrate Websocket

```bash
php artisan reverb:start
```
ဆိုပြီး socket server ကို start လုပ်ပါမယ်။

ပြီးရင် 

```bash
php artisan queue:listen
```
ဆိုပြီး Queue Worker ကို start လုပ်ပါမယ်။

ပြီးရင်တော့ စောနက `play.blade.php` မှာ အခုလိုရေးပါမယ်။

```html
<?php
 
use App\Events\CharacterUpdated;
 
$updateCharacter = function(string $character) {
    CharacterUpdated::dispatch($character);
};
 
?>

<x-layouts.app title="Play">
    @volt
    <div id="playground" class="w-full h-screen flex items-center" style="background: rgb(74 222 128)">
        <div class="w-1/2">
            <img wire:click="updateCharacter('green')" class="cursor-pointer w-64 mx-auto" src="/earth_spirit.png"
                alt="radiant">
        </div>
        <div class="w-1/2">
            <img wire:click="updateCharacter('red')" class="cursor-pointer w-64 mx-auto" src="/mars.png" alt="dire">
        </div>
    </div>
    @endvolt

    <script type="module">
        Echo.channel('character')
            .listen('CharacterUpdated', (e) => {
                if(e.character == 'green') {
                    document.getElementById('playground').style.background = 'rgb(74 222 128)';
                } else if (e.character == 'red') {
                    document.getElementById('playground').style.background = 'rgb(248, 113, 113)';
                }
            });
    </script>
</x-layouts.app>
```

php tag ထဲက code တွေက volt ကြောင့် အဲ့လိုလိုရေးလို့ရတာပါ။ `updateCharacter` ဆိုတဲ့ function တစ်ခုရှိပါတယ်။​ အဲ့ function ကိုခေါ်ရင် `CharacterUpdated` event ကို dispatch လုပ်သွားမှာပါ။

`@volt @endvolt` ထဲက code တွေက livewire anonymous component လို့ယူဆသွားမှာပါ။ `wire:click="updateCharacter('green')"` က ပုံကို နှိပ်လိုက်ရင် updateCharacter function ကို green ဆိုတဲ့ value pass ပြီး ခေါ်သွားမှာပါ။

```js
Echo.channel('character')
    .listen('CharacterUpdated', (e) => {
        if(e.character == 'green') {
            document.getElementById('playground').style.background = 'rgb(74 222 128)';
        } else if (e.character == 'red') {
            document.getElementById('playground').style.background = 'rgb(248, 113, 113)';
        }
    });
```
ဒါကတော့ Laravel Echo နဲ့ရေးထားတာပါ။​ သူက character channel ကို join ပြီး CharacterUpdated event ကို listen လုပ်ပါတယ်။ event ထဲက character က `green` ဆိုရင် background ကို အစိမ်းပြောင်းပြီး `red` ဆိုရင် အနီပြောင်းပါတယ်။ ဒါဆိုရင် CharacterUpdated ကို dispatch လုပ်တိုင်း `/play` ကိုဖွင့်ထားတဲ့ device တိုင်းမှာ real-time background ပြောင်းနေမှာပါ။

Frontend ကို javascript framework ဒါမှမဟုတ် android app ကနေသုံးမယ်ဆိုရင် pusher ကို အခုလိုမျိုး ချိတ်လို့ရပါတယ်။

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body>
    <div id="playground" class="w-full h-screen flex items-center" style="background: rgb(74 222 128)">
        <div class="w-1/2">
            <img class="cursor-pointer w-64 mx-auto" src="/earth_spirit.png" alt="radiant">
        </div>
        <div class="w-1/2">
            <img class="cursor-pointer w-64 mx-auto" src="/mars.png" alt="dire">
        </div>
    </div>

    <script src="https://js.pusher.com/8.0.1/pusher.min.js"></script>

    <script>
        var pusher = new Pusher('ns5vuegxbudmxyrdyfnb', {
            appId: '286585',
            secret: 'zdveddmzanu54wsqw7ad',
            wsHost: '127.0.0.1',
            wsPort: 8080,
            forceTLS: false,
            enabledTransports: ['ws'],
            cluster: ''
        });

        var channel = pusher.subscribe('character');

        channel.bind('App\\Events\\CharacterUpdated', (data) => {
            if (data.character == 'green') {
                document.getElementById('playground').style.background = 'rgb(74 222 128)';
            } else if (data.character == 'red') {
                document.getElementById('playground').style.background = 'rgb(248, 113, 113)';
            }
        });
    </script>
</body>

</html>
```

ဒီဟာဆိုရင် pure html မှာ official pusher js နဲ့ ချိတ်ပြီး ရေးပြထားတာပါ။

Source code ကို [ဒီမှာ](https://github.com/PyaeSoneAungRgn/real-time-applicaion-with-laravel) ကြည့်လို့ရပါတယ်။ တခြား real-time POC ရေးထားတဲ့ project တစ်ခုကိုလည်း [PyaeSoneAungRgn/realtime-reaction](https://github.com/PyaeSoneAungRgn/realtime-reaction) မှာ ကြည့်လို့ရပါတယ်။ သိချင်တာရှိရင်လည်း မေးလို့ရပါတယ် ခဗျာ။
