---
title: SHIFT Workbench
date: '2022-11-10'
description: >-
  SHIFT Workbench ဆိုတာကတော့ Laravel နဲ့ PHP code တွေကို automation tasks တွေနဲ့
  modernize ဖြစ်အောင်လုပ်ပေးတာပါ။
image: 'https://og.pyaesoneaung.dev/og?title=SHIFT Workbench'
---
SHIFT Workbench ဆိုတာကတော့ Laravel နဲ့ PHP code တွေကို automation tasks တွေနဲ့ modernize ဖြစ်အောင်လုပ်ပေးတာပါ။

Workbench မှာ လက်ရှိစာရေးနေတဲ့ အချိန်ထိ automation tasks ၆၀ ကျော်ပါတယ်။ အဲ့ထဲကမှ တချို့ကို highlight လုပ်ပြီးရှင်းပြချင်ပါတယ်။

### Nullsafe Operator

`$val == null` အဲ့လိုရေးထားတဲ့ syntax တွေကို `$val?->` လို့ပြောင်းပေးတာပါ။ (PHP 8 နဲ့ အထက် ရှိဖို့လိုပါတယ်။)

**Before**

```php
if ($user === null) {
    return null;
}

return $user->email();
```

**After**

```php
return $user?->email();
```

### Arrow Functions

ရိုးရိုး closure fuction တွေကို arrow function ပြောင်းပေးတာပါ။ (PHP 7.4 နဲ့ အထက် ရှိဖို့လိုပါတယ်။)

**Before**

```php
array_filter($values, function ($value) {
    return is_numeric($value);
});
```

**After**

```php
array_filter($values, fn($value) => is_numeric($value));
```

### Optional To Nullsafe

`optional($user)->address;` အဲ့လိုရေးထားတဲ့ syntax တွေကို `$user?->address;` လို့ပြောင်းပေးတာပါ။ (PHP 8 နဲ့ အထက် ရှိဖို့လိုပါတယ်။)

**Before**

```php
optional($user)->address;
```

**After**

```php
$user?->address;
```

### Sort Tailwind Classes

tailwindcss ရဲ့ [recommend class order](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted) အတိုင်း class တွေကို order စီပေးတာပါ။

**Before**

```html
<div
  class="text-gray-700 hover:opacity-75 shadow-md p-3 lg:p-6 border-gray-300 ml-4 h-24 flex border-2"
>
  <!-- ... -->
</div>
```

**After**

```html
<div
  class="ml-4 flex h-24 border-2 border-gray-300 p-3 text-gray-700 shadow-md lg:p-6 hover:opacity-75"
>
  <!-- ... -->
</div>
```

အခုပြောထားတာတွေအပြင် တခြား အသုံးဝင်တဲ့ automation tasks တွေအများကြီးရှိပါတယ်။ တချို့ tasks အနည်းငယ်ကိုတော့ license ဝယ်သုံးမှရပါမယ်။

Workbench ကို Desktop App (သို့) Cloud Based ဆိုပြီး ၂ မျိုး အသုံးပြုလို့ရပါတယ်။

### Desktop App

[laravelshift.com/workbench](https://laravelshift.com/workbench) website ကနေ သက်ဆိုင်ရာ platform အတွက် download ဆွဲလို့ရပါတယ်။ Install လုပ်ပြီးသွားရင် project path ရွေးပြီး သုံးလို့ရပါပြီ။ (Workbench ကို သုံးဖို့ docker client ကို ဖွင့်ထားပေးဖို့လိုပါတယ်။)

![shift-workbench-img-1](/assets/img/blog/shift-workbench-img-1.png)

### Cloud Based

[laravelshift.com](https://laravelshift.com) မှာ account ဖွင့်ဖို့လိုပါတယ်။ ပြီးရင် Workbench ကိုရွေးပြီး သုံးလို့ရပါပြီ။

![shift-workbench-img-2](/assets/img/blog/shift-workbench-img-2.png)

ကိုယ် run ချင်တာတွေ သတ်မှတ်ပြီးပြီဆိုရင် repository ကို ရွေးပြီး run လို့ရပါပြီ။

![shift-workbench-img-3](/assets/img/blog/shift-workbench-img-3.png)

Run ပြီးသွားရင် github မှာ Workbench ကနေ pull request တက်လာပါမယ်။

![shift-workbench-img-4](/assets/img/blog/shift-workbench-img-4.png)

Pull request ကို merge လုပ်လိုက်ရင် အားလုံးပြီးပါပြီ။

[Laravel SHIFT](https://laravelshift.com) ကနေပဲ နောက်ထပ် [mix ကနေ vite](https://laravelshift.com/convert-laravel-mix-to-vite) ကို free upgrade လုပ်တဲ့ services တွေလည်းရှိပါတယ်။ အသေးစိတ်ကို [ဒီမှာ](https://laravelshift.com) ကြည့်လို့ရပါတယ်။
