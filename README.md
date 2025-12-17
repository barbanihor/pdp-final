# Shopify PDP Theme

Shopify тема з повною реалізацією Product Detail Page (сторінки продукту).

## Як запустити

### 1. Встановити Shopify CLI
```bash
npm install -g @shopify/cli @shopify/theme
```

### 2. Залогінитись
```bash
shopify auth login
```

### 3. Запустити локально
```bash
shopify theme dev
```

Відкриється локальний сервер з preview URL.

### 4. Задеплоїти на Shopify
```bash
shopify theme push
```

## Що реалізовано

### Product Detail Page

#### Основна секція продукту
- Галерея з превʼюшками (перша картинка eager, решта lazy)
- Підтримка відео (HTML5, YouTube, Vimeo) з автоплеєм
- Вибір кольору через related products
- Вибір розміру
- Динамічна ціна (зі знижкою і без)
- Статус наявності (в наявності, мало, закінчується, немає)
- Рейтинг продукту
- Акордеон з деталями
- Sticky Add to Cart при скролі

#### Рекомендації
- Секція "You May Also Like"
- Slider з продуктами
- Оновлюється при зміні кольору

#### Відгуки
- Відображення відгуків з рейтингом
- Fallback відгуки якщо немає даних

#### Hero Banner
- Банер з кнопкою
- Редагується в кастомайзері

### Header & Footer
- Адаптивна навігація
- Кошик з іконкою
- Footer з акордеоном на мобілці

### Кошик
- Додавання/видалення товарів
- Зміна кількості
- Підсумок замовлення

### Головна
- Грід з усіма продуктами
- Адаптивний: 2 → 3 → 4 колонки

## Метафілди

### 1. Related Products (кольори)
```
Namespace: custom
Key: related_products
Type: list.product_reference
```
Використовується для вибору кольору - список продуктів різних кольорів.

### 2. Accordion (деталі продукту)
```
Namespace: custom
Key: accordion
Type: list.metaobject_reference
```
Потрібно створити metaobject definition "accordion_item" з полями:
- `title` - заголовок
- `content` - текст

### 3. Tagline (опціонально)
```
Namespace: custom
Key: tagline
Type: single_line_text_field
```
Додаткова інформація під продуктом.

### 4. Reviews (опціонально)
```
Namespace: custom
Key: review_json
Type: json
```
Формат:
```json
[
  {
    "stars": 5,
    "review": "Текст відгуку",
    "name": "Імʼя",
    "town": "Місто",
    "photo": "URL фото"
  }
]
```
Якщо не заповнено - показуються fallback відгуки.

## Структура

```
.
├── assets/           # CSS, JS, картинки
├── sections/         # Секції (header, footer, main-product, etc.)
├── snippets/         # Компоненти (price-block, accordion, etc.)
├── templates/        # Шаблони сторінок
└── locales/          # Переклади (en, uk)
```

## Секції для мерчанта

### Main Product
Основна секція продукту. Налаштування:
- Показати бейдж "Highly Rated"
- Рейтинг (1-5)
- Текст рейтингу

### Product Recommendations
Автоматичні рекомендації від Shopify. Без налаштувань.

### Product Reviews
Відгуки. Налаштовується через метафілд `review_json`.

### Hero Banner
Налаштування:
- Заголовок
- Опис
- Текст кнопки

## Доступність (A11y)

- Клавіатурна навігація (Tab, Enter, Space)
- ARIA labels для скрінрідерів
- Semantic HTML
- Alt текст на картинках
- Правильні heading рівні

## Переклади

Підтримка мов:
- Англійська (en.default.json)
- Українська (uk.json)

Додати нову мову:
1. Створити файл `locales/CODE.json`
2. Скопіювати структуру з `en.default.json`
3. Перекласти

## Оптимізації

- Lazy loading картинок (крім першої)
- Eager loading для першої картинки
- Defer для JS
- Responsive images з srcset
- Мінімальний CSS у critical path

## Підтримка браузерів

- Chrome, Firefox, Safari, Edge (останні 2 версії)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)
