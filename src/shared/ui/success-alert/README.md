# SuccessAlert

Зелёное сообщение об успешном действии, например «Your post has been published».

## Назначение

После успеха окно часто закрывается и открывается другая страница: после публикации поста открывается профиль, после удаления поста прошлая страница. Обычный `Alert` внутри окна пропал бы вместе с окном. Поэтому текст сообщения хранится в Redux, а показывает его компонент `SuccessAlert`, который стоит один раз в корневом `app/layout.tsx` и не пропадает при переходах.

Как работает:

-   `useSuccessAlert()` возвращает функцию `showSuccess(текст)`. Её вызывают после успешного запроса. Она кладёт текст в слайс `successAlert` в Redux.
-   `SuccessAlert` читает текст из стора и показывает `Alert` с `type="success"`, как в макете: зелёный, внизу слева, со словом «Success!» перед текстом и с крестиком.
-   Сообщение закрывается само через 3 секунды или по крестику.
-   Если открыто окно (`<dialog>`), сообщение рисуется внутри последнего открытого окна. Иначе оно оказалось бы под окном, и крестик не нажимался бы.

Ошибки этот компонент не показывает. Ошибку показывают обычным `Alert` внутри формы или окна: пользователь остаётся там же и может повторить действие.

## Импорт

```tsx
import { useSuccessAlert } from '@/shared/ui/success-alert';
```

## Использование

```tsx
const showSuccess = useSuccessAlert();

const handleDelete = async (): Promise<void> => {
    await mutateAsync(postId);
    showSuccess('Post deleted successfully');
    onDeleted(); // после этого можно уходить на другую страницу
};
```

## Подключение

Уже подключено, повторять не нужно:

-   редьюсер `successAlertReducer` добавлен в стор в `src/app/store/makeStore.ts` под ключом `successAlert`;
-   `SuccessAlert` стоит в `app/layout.tsx` внутри `StoreProvider`.

```tsx
<StoreProvider>
    <QueryProvider>
        <Header />
        {children}
        {modal}
        <SuccessAlert />
    </QueryProvider>
</StoreProvider>
```

Как устроен стор, описано в [docs/redux.md](../../../../docs/redux.md).

## Где используется

| Действие                   | Текст                          | Файл                                               |
| -------------------------- | ------------------------------ | -------------------------------------------------- |
| Publish при создании поста | `Your post has been published` | `src/features/create-post/ui/CreatePostWindow.tsx` |
| Save Changes при правке    | `Post updated successfully`    | `src/features/edit-post/ui/EditPostForm.tsx`       |
| Yes в вопросе удаления     | `Post deleted successfully`    | `src/features/delete-post/ui/DeletePostModal.tsx`  |
