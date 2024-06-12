# Green-Spaces-Strategy-Development



## Tech stack

 - React
 - Maplibre-GL
 - Material UI
 - Tailwind CSS

Для фонових тайлів використовуються тайлсервери OpenstreetMap UA (Fozzy Group) та CartoCDN як резервний.

# Технічне покращення

Стилізація звиайних компонентів відбувається з допомогою Tailwind CSS в традиційному для Tailwind стилі: додаванням відповідних класів в className компонентів. Документацію (в тому числі всі доступні для використання класи Tailwind) можна знайти [здесь](https://tailwindcss.com/docs/preflight). Для спрощення розробки за основу взяті налаштування Preflight на базі modern-normalize (включати його в проект окремо не потрібно!).

Виняток складають компоненти Material UI (переважно це елементи форм).

