---
title: Blueprint
date: '2022-11-16'
description: >-
  Blueprint ဆိုတာကတော့ Laravel အတွက် code generate ထုတ်ပေးတဲ့ tool တစ်ခုပါ။
  Blueprint မှာကောင်းတာကတော့ draft.yml confing file တစ်ခုတည်းကနေ manage
  လုပ်လို့ရတာပါ။
image: 'https://og.pyaesoneaung.dev/og?title=Blueprint'
---
[Blueprint](https://blueprint.laravelshift.com) ဆိုတာကတော့ Laravel အတွက် code generate ထုတ်ပေးတဲ့ tool တစ်ခုပါ။ Blueprint မှာကောင်းတာကတော့ `draft.yaml` confing file တစ်ခုတည်းကနေ manage လုပ်လို့ရတာပါ။

### Installation

```bash
composer require --dev laravel-shift/blueprint
```

### Usage

နမူနာ အနေနဲ့ Article CRUD အတွက် လိုအပ်တာတွေကို Generate ထုတ်ပြပါမယ်။

အရင်ဆုံး `draft.yaml` မှာ အခုလို models တွေဆောက်ပါမယ်။

```yaml
models:
  Category:
    title: string

  Article:
    title: string
    description: text
    published_at: nullable timestamp
    category_id: id foreign
```

ပြီးရင် terminal ကနေ

```bash
php artisan blueprint:build
```

လို့ run လိုက်ရင် အခုလို file တွေကို generate ထုတ်သွားမှာပါ။

```bash
Created:
- database/factories/CategoryFactory.php
- database/factories/ArticleFactory.php
- database/migrations/2022_11_26_121326_create_categories_table.php
- database/migrations/2022_11_26_121327_create_articles_table.php
- app/Models/Category.php
- app/Models/Article.php
```

အဲ့ထဲကမှာ `2022_11_26_121327_create_articles_table.php` ကို ကြည့်ရင်

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->timestamp('published_at')->nullable();
            $table->foreignId('category_id')->constrained();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('articles');
    }
}
```

အခုလို `draft.yaml` မှာ သတ်မှတ်ထားတဲ့အတိုင်း migration file တစ်ခုထုတ်ပေးထားပါတယ်။

`app/Models/Article.php` မှာလည်း

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'published_at',
        'category_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'published_at' => 'timestamp',
        'category_id' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
```

Category ကို BelongsTo relationship ချိတ်ထားပေးပါတယ်။

လိုအပ်တဲ့ models တွေ create လုပ်ပြီးပြီဆိုတော့ Article CRUD အတွက် `index()` နဲ့ `store()` functions တွေပါတဲ့ Controller တစ်ခုဆောက်ပါမယ်။ Controller ဆောက်ဖို့ `draft.yaml` မှာပဲ ခုလိုထပ်ထည့်ပါမယ်။

```yaml
models:
  Category:
    title: string

  Article:
    title: string
    description: text
    published_at: nullable timestamp
    category_id: id foreign

controllers:
  Article:
    index:
      query: all:articles
      render: article.index with:articles
    store:
      validate: title, description
      save: article
      redirect: article.index
```

ပြီးရင် generate ထုတ်ဖို့

```bash
php artisan blueprint:build
```

လို့ run ပါမယ်။ ဒါဆိုရင် အခုလိုမျိုး file တွေ generate ထုတ်ပေးမှာပါ။

```bash
Created:
- app/Http/Controllers/ArticleController.php
- database/factories/CategoryFactory.php
- database/factories/ArticleFactory.php
- database/migrations/2022_11_26_125212_create_categories_table.php
- database/migrations/2022_11_26_125213_create_articles_table.php
- app/Models/Category.php
- app/Models/Article.php
- tests/Feature/Http/Controllers/ArticleControllerTest.php
- app/Http/Requests/ArticleStoreRequest.php
- resources/views/article/index.blade.php

Updated:
- routes/web.php
```

အဲ့ထဲကမှ `app/Http/Controllers/ArticleController.php` ကိုကြည့်မယ်ဆိုရင်

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleStoreRequest;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $articles = Article::all();

        return view('article.index', compact('articles'));
    }

    /**
     * @param \App\Http\Requests\ArticleStoreRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(ArticleStoreRequest $request)
    {
        $article = Article::create($request->validated());

        return redirect()->route('article.index');
    }
}
```

`index()` နဲ့ `store()` function ၂ခု ကို တွေ့ရပါမယ်။

`store()` function ကို ကြည့်ရင် validation အတွက် `ArticleStoreRequest` class ကိုသုံးထားတာတွေ့မှာပါ။

`app/Http/Requests/ArticleStoreRequest.php` file ကိုကြည့်ရင်

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArticleStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => ['required', 'string'],
            'description' => ['required', 'string'],
        ];
    }
}
```

`draft.yaml` မှာ သတ်မှတ်တားတဲ့အတိုင်း validation စစ်ထားပါတယ်။

Article CRUD တစ်ခုလုံးအတွက် generate ထုတ်ချင်ရင် အခုလို shorthand ရေးလို့ရပါတယ်။

```yaml
models:
  Category:
    title: string

  Article:
    title: string
    description: text
    published_at: nullable timestamp
    category_id: id foreign

controllers:
  Article: resource
```

ဒါဆိုရင် Article CRUD အတွက်လိုအပ်တာတွေအကုန်လုံး generate ထုတ်သွားပေးမှာပါ။

Generate လုပ်ထားတာတွေပြန်ဖျက်ချင်ရင်တော့

```bash
php artisan blueprint:erase
```

ဆိုပြီး run လို့ရပါတယ်။

Blueprint ကျွန်တော် highlight လုပ်ပြသွားတာတွေအပြင် နောက်ကွယ်ကနေ factories၊ views နဲ့ tests တွေလည်း generate ထုတ်ပေးပါတယ်။

အသေးစိတ်ကိုတော့ [Blueprint Official Documentation](https://blueprint.laravelshift.com) မှာ ကြည့်လို့ရပါတယ်။
