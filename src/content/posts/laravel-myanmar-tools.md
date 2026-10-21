---
title: Laravel Myanmar Tools
date: '2023-03-10'
description: >-
  Laravel Myanmar Tools ဆိုတာကတော့ မြန်မာဘာသာစကား အတွက်လိုအပ်တာတွေကို Laravel
  framework ရဲ့ core component တွေမှာ extend လုပ်ထားတဲ့ package တစ်ခုဖြစ်ပါတယ်။
image: 'https://og.pyaesoneaung.dev/og?title=Laravel Myanmar Tools'
---
[Laravel Myanmar Tools](https://github.com/PyaeSoneAungRgn/laravel-myanmar-tools) ဆိုတာကတော့ မြန်မာဘာသာစကား အတွက်လိုအပ်တာတွေကို Laravel framework ရဲ့ core component တွေမှာ extend လုပ်ထားတဲ့ package တစ်ခုဖြစ်ပါတယ်။

ဒီ package ကို ကျွန်တော် စရေးဖို့ အကြံရတာကတော့ Laravel Macro ကို လေ့လာပြီးတဲ့ အချိန်မှာပါ။ Macro ကိုသုံးပြီး မြန်မာဘာသာအတွက် လူသုံးများတဲ့ [Rabbit-PHP](https://github.com/Rabbit-Converter/Rabbit-PHP)၊ [myanmar-phone-number-php](https://github.com/johnreginald/myanmar-phone-number-php) တို့လို packages တွေကို Laravel ရဲ့ core component မှာ extend လုပ်မယ်ဆိုပြီး ရေးဖြစ်တာပါ။ Laravel Macro အကြောင်းကို ကျွန်တော် [ဒီမှာ](/posts/laravel-macros) ရေးထားပါတယ်။

### Installation

```bash
composer require pyaesoneaung/laravel-myanmar-tools
```

### Usage

လက်ရှိ စာရေးနေတဲ့အချိန် မှာတော့ Laravel ရဲ့ core component **(၇)** ခုကို extend လုပ်ထားပါတယ်။

- Str
- Request
- Eloquent Builder
- Query Builder
- Collection
- Validator
- Carbon

#### Str

```php
use Illuminate\Support\Str;

// font
Str::isUnicodeFont('မြန်မာပြည်'); // true
Str::isZawgyiFont('ျမန္မာျပည္'); // true
Str::detectMyanmarFont('မြန်မာပြည်'); // "unicode"
Str::zgToUni('ျမန္မာျပည္'); // "မြန်မာပြည်"
Str::uniToZg('မြန်မာပြည်'); // "ျမန္မာျပည္"

// phone
Str::isMyanmarPhoneNumber('09250000000'); // true
Str::isMpt('09250000000'); // true
Str::isOoredoo('09970000000'); // true
Str::isTelenor('09790000000'); // true
Str::isMec('0930000000'); // true
Str::isMytel('09690000000'); // true
Str::telecomName('09250000000'); // "mpt"
Str::normalizeMyanmarPhoneNumber('(၀၉)၂၅၀၀၀၀၀၀၀'); // "09250000000"

// nrc
Str::isNrc('12/OUKAMA(N)123456'); // true
Str::normalizeNrc('၁၂/ဥကမ(နိုင်)၁၂၃၄၅၆'); // "12/OUKAMA(N)123456"
```

#### Request

```php
// font
$request->isUnicodeFont('မြန်မာပြည်'); // true
$request->isZawgyiFont('ျမန္မာျပည္'); // true
$request->detectMyanmarFont('မြန်မာပြည်'); // "unicode"
$request->zgToUni('ျမန္မာျပည္'); // "မြန်မာပြည်"
$request->uniToZg('မြန်မာပြည်'); // "ျမန္မာျပည္"

// phone
$request->isMyanmarPhoneNumber('09250000000'); // true
$request->isMpt('09250000000'); // true
$request->isOoredoo('09970000000'); // true
$request->isTelenor('09790000000'); // true
$request->isMec('0930000000'); // true
$request->isMytel('09690000000'); // true
$request->telecomName('09250000000'); // "mpt"
$request->normalizeMyanmarPhoneNumber('(၀၉)၂၅၀၀၀၀၀၀၀'); // "09250000000"

// nrc
$request->isNrc('12/OUKAMA(N)123456'); // true
$request->normalizeNrc('၁၂/ဥကမ(နိုင်)၁၂၃၄၅၆'); // "12/OUKAMA(N)123456"
```

#### Eloquent Builder

```php
use App\Models\Customer;

// phone
Customer::whereMyanmarPhoneNumber('phone')->first();
Customer::whereMpt('phone')->first();
Customer::whereOoredoo('phone')->first();
Customer::whereTelenor('phone')->first();
Customer::whereMec('phone')->first();
Customer::whereMytel('phone')->first();
```

#### Query Builder

```php
// phone
DB::table('customers')->whereMyanmarPhoneNumber('phone')->first();
DB::table('customers')->whereMpt('phone')->first();
DB::table('customers')->whereOoredoo('phone')->first();
DB::table('customers')->whereTelenor('phone')->first();
DB::table('customers')->whereMec('phone')->first();
DB::table('customers')->whereMytel('phone')->first();
```

#### Collection

```php
// font
collect($data)->uniToZg()->toArray();
collect($data)->zgToUni()->toArray();

// phone number
collect($data)->whereMyanmarPhoneNumber()->toArray();
collect($data)->whereMpt()->toArray();
collect($data)->whereOoredoo()->toArray();
collect($data)->whereTelenor()->toArray();
collect($data)->whereMec()->toArray();
collect($data)->whereMytel()->toArray();
```

#### Validator

```php
// phone number
$request->validate([
    'phone' => ['required', 'myanmarPhoneNumber'],
]);
$request->validate([
    'phone' => ['required', 'mpt'],
]);
$request->validate([
    'phone' => ['required', 'ooredoo'],
]);
$request->validate([
    'phone' => ['required', 'telenor'],
]);
$request->validate([
    'phone' => ['required', 'mec'],
]);
$request->validate([
    'phone' => ['required', 'mytel'],
]);

// nrc
$request->validate([
    'nrc' => ['required', 'nrc'],
]);
```

#### Carbon

```php
use Illuminate\Support\Carbon;

// date
Carbon::parse('2023-01-04')->isIndependenceDay(); // true
Carbon::parse('2023-02-12')->isUnionDay(); // true
Carbon::parse('2023-03-02')->isPeasantsDay(); // true
Carbon::parse('2023-05-01')->isLabourDay(); // true
Carbon::parse('2023-07-19')->isMartyrsDay(); // true
```

အသုံးပြုပုံ အသေးစိတ်ကို [https://laravel-myanmar-tools.com](https://laravel-myanmar-tools.com/#/) မှာ ကြည့်လို့ရပါတယ်။

### Conclusion

[Laravel Myanmar Tools](https://github.com/PyaeSoneAungRgn/laravel-myanmar-tools) ကိုအသုံးပြုပြီး မြန်မာစာနဲ့ ပတ်သက်တဲ့ အခက်ခဲတစ်ချို့ကို ဖြေရှင်းနိုင်မယ်လို့ မျှော်လင့်ပါတယ်။ PHP အတွက်သီးသန့်သုံးချင်တယ်ဆိုရင် [Laravel Myanmar Tools](https://github.com/Laravel-Myanmar-Tools) organization ကနေ သက်ဆိုင်ရာ repo ကိုရွေးချယ် အသုံးပြုလို့ရပါတယ်။
