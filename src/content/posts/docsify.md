---
title: Docsify
date: '2023-03-15'
description: Docsify ဆိုတာကတော့ documentation site generator တစ်ခုပါ။
image: 'https://og.pyaesoneaung.dev/og?title=Docsify'
---
Update: 2023-08-27

လက်ရှိစာရေးနေတဲ့ အချိန်မှာတော့ Docsify အစား VitePress ကို ပြောင်းသုံးနေပါပြီ။ အသေးစိတ်ကို [ဒီမှာ](/posts/build-a-modern-documentation-site) ကြည့်လို့ ရပါတယ်။

<hr />

Docsify ဆိုတာကတော့ documentation site generator တစ်ခုပါ။ Markdown နဲ့ရေးထားတဲ့ file တွေကို load လုပ်ပြီး website အနေနဲ့ ပြပေးတာပါ။

### Examples

- [free-for-dev](https://free-for.dev/#/) - Free for Developers
- [Polly.js](https://netflix.github.io/pollyjs/#/) - Record, replay, and stub HTTP interactions

### Installation

Docsify ကို npm ကနေ install လုပ်လို့ရပါတယ်။

```bash
npm i docsify-cli -g
```

### Usage

နမူနာအနေနဲ့ [to-raw-sql](https://github.com/PyaeSoneAungRgn/to-raw-sql) package အတွက် documentation site တစ်ခု generate လုပ်ပါမယ်။

အရင်ဆုံး git clone လုပ်ပါမယ်။

```bash
git clone https://github.com/PyaeSoneAungRgn/to-raw-sql.git
cd to-raw-sql
```

ပြီးရင်

```bash
docsify init ./docs
```

လို့ run လိုက်ရင် `docs` ဆိုတဲ့ folder အသစ်ဆိုတဲ့ တစ်ခု create လုပ်သွားပါမယ်။ `docs` folder ထဲမှာ `index.html` နဲ့ `README.md` ဆိုပြီး file နှစ်ခုတွေ့ရပါမယ်။ (ဒီနေရာမှာ `docs` folder ထဲက `README.md` file က root folder ရဲ့ `README.md` file နဲ့ အတူတူဖြစ်နေမှာပါ။ Docsify က auto ကူးထည့်ပေးထားတာပါ။)

Preview ကြည်ဖို့အတွက်

```bash
docsify serve docs
```

လို့ run ပါမယ်။ ဒါဆိုရင် အခုလို ရပါပြီ။

![docsify-1.png](/assets/img/blog/docsify-1.png)

ဒီနေရမှာ code တွေ syntax highlight ဖြစ်အောင် plugin ထည့်ပေးရပါမယ်။

`index.html` မှာ

```html
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-bash.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-php.min.js"></script>
```

ဆိုပြီး body အပိတ် tag မတိုင်ခင် ထည့်လိုက်ရင် ရပါပြီ။ Final version ကို [ဒီမှာ](https://pyaesoneaungrgn.github.io/to-raw-sql/#/) ကြည့်လို့ရပါတယ်။

### Conclusion

တခြား theme ချိန်းတာတို့၊ plugin တွေထည့်တာတို့၊ customization လုပ်တာတွေကို [Docify Documentation](https://docsify.js.org/#/?id=docsify) မှာလေ့လာလို့ရပါတယ်။ ကျွန်တော်ကိုယ်တိုင်လည်း Docify ကိုသုံးပြီး [Laravel Myanmar Tools](https://laravel-myanmar-tools.com/#/) documentation ကိုရေးထားပါတယ်။ Document's source Code ကိုတော့ [ဒီမှာ](https://github.com/Laravel-Myanmar-Tools/docs) ကြည့်လို့ရပါတယ်။ သိချင်တာရှိရင်လည်း မေးလို့ရပါတယ်ခဗျာ။
