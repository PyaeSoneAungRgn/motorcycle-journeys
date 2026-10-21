---
title: Laravel Envoy
date: '2023-01-01'
description: >-
  Laravel Envoy ဆိုတာကတော့ remote server ပေါ်မှာ run ချင်တဲ့ task တွေကို Blade
  syntax နဲ့ လွယ်လွယ်ကူကူ manage လုပ်လို့ရတဲ့ tool တစ်ခုဖြစ်ပါတယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Laravel Envoy'
---
[Laravel Envoy](https://laravel.com/docs/9.x/envoy) ဆိုတာကတော့ remote server ပေါ်မှာ run ချင်တဲ့ task တွေကို Blade syntax နဲ့ လွယ်လွယ်ကူကူ manage လုပ်လို့ရတဲ့ tool တစ်ခုဖြစ်ပါတယ်။

### Installation

```bash
composer require laravel/envoy --dev
```

### Usage

Project ရဲ့ root folder အောက်မှာ `Envoy.blade.php` ဆိုပြီး file တစ်ခု create လုပ်ပါမယ်။

`Envoy.blade.php`

```blade
@servers(['web' => ['user@192.168.1.1']])

@task('deploy', ['on' => 'web'])
    cd /home/user/example.com
    git pull
@endtask

@task('log', ['on' => 'web'])
    cd /home/user/example.com
    tail -f storage/logs/laravel-{{ date('Y-m-d') }}.log
@endtask
```

`@servers` မှာ ကိုယ့်ရဲ့ remote server ထည့်ပေးရပါမယ်။ Load balancing သုံးတယ်ဆိုရင် web array ထဲမှာ လိုသလို ထပ်ထည့်လို့ ရပါတယ်။

`@task('deploy', ['on' => 'web'])` ဆိုတာကတော့ deploy ဆိုတဲ့ နာမည်နဲ့ task တစ်ခု create လုပ်ပြီး web array ထဲက server တွေမှာ run မယ်လို့ သတ်မှတ်လိုက်တာပါ။

`@task('log', ['on' => 'web'])` ဆိုတာလည်း အပေါ်ကတိုင်းပါပဲ။

deploy task ကို run ဖို့အတွက်

```bash
php vendor/bin/envoy run deploy
```

log task ကို run ဖို့အတွက်

```bash
php vendor/bin/envoy run log
```

ဒါဆိုရင် git pull ဖို့ server ထဲဝင်တဲ့ ကိစ္စတွေ၊ error log ကြည့်ဖို့ server ထဲဝင်တဲ့ ကိစ္စတွေ၊ load balancing မှာ server တစ်ခုချင်းဆီ ဝင် pull ရတဲ့ ကိစ္စတွေကို တစ်ဖက်တစ်လမ်းက ဖြေရှင်းနိုင်မယ်လို့ ယုံကြည်ပါတယ်။

Envoy မှာ variables တွေထပ်ထည့်လို့ရပါတယ်။

```bash
php vendor/bin/envoy run deploy --branch=master
```

```blade
@servers(['web' => ['user@192.168.1.1']])

@task('deploy', ['on' => 'web'])
    cd /home/user/example.com

    @if ($branch)
        git pull origin {{ $branch }}
    @endif
@endtask
```

ဒါဆိုရင် ကိုယ်သတ်မှတ်လိုက်တဲ့ branch ကို pull သွားမှာပါ။

နောက်ထပ် story ဆိုတာလည်းရှိပါတယ်။

```bash
php vendor/bin/envoy run deploy
```

```blade
@servers(['web' => ['user@192.168.1.1']])

@story('deploy')
    update-code
    install-dependencies
@endstory

@task('update-code')
    cd /home/user/example.com
    git pull origin master
@endtask

@task('install-dependencies')
    cd /home/user/example.com
    composer install
@endtask
```

ဒါဆိုရင် story မှာ group လုပ်ထားတဲ့ task တွေကို run သွားမှာပါ။

Envoy ရဲ့ parallel၊ setup၊ hook တို့အပြင် တခြား အရေးကြီးတာတွေကို [Official Documention](https://laravel.com/docs/9.x/envoy) မှာဆက်လက်လေ့လာလို့ရပါတယ်။

ပျော်ရွင်စရာ နှစ်သစ် ဖြစ်ပါစေ။
