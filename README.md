# OVARC TASK

## Tech Stack

- **Vite**: Fast build tool and dev server.
- **React Router**: Dynamic routing with code splitting.
- **Tailwind CSS**: Utility-first CSS framework.

## Setup

1. **Install dependencies**:

    ```bash
    npm install
    ```

2. **Start the JSON server** (in a separate terminal):

    ```bash
    npm run server
    ```

3. **Start the development server**:

    ```bash
    npm run dev
    ```

4. **Build for production**:
    ```bash
    npm run build
    ```

> **Note**: The application requires both the JSON server (port 4000) and the development server (port 5173) to be running simultaneously for full functionality.

## Features

1. **Shop Page**:

    It has a list of cards containing the book cover page, title & author, and which stores this book is available in. The sell button should mark this as sold but keep the card on the page.

2. **Authors Page**

    It has a simple list of authors and two CTAs to edit the name (in-line edit) or delete the author entirely. There is a CTA & a modal too for adding a new author.

3. **Books Page**

    It has a list of books, the number of pages, and who the author is. The edit CTA is an in-line edit for the book title.

4. **Stores Page**

    Same as the above two. The entire row is a CTA for the next page.

5. **Store Inventory Page**

    This is where the admin adds more books to the store's
    inventory. The books should be viewable either in a list view or grouped by the author via the tab selection. The add to inventory CTA pops up a modal to select the new book and set its price.

6. **Authentication System**

    The application includes a mock authentication system with demo accounts. Users must sign in to perform actions like adding inventory, editing, or deleting items. Demo account: `admin` / `admin123`.

## Project Structure

- src/pages/: Contains page components like Home, BrowseStores, Browse, BrowseAuthors, and Inventory.

- src/components/: Includes reusable UI components such as StoreCard, BookCard, AuthorCard, BooksTable, Modal, and Header.

- src/hooks/: Custom hooks like useLibraryData for data fetching and state management.

- src/assets/: Stores static assets like author images (a1.png, a2.png).

- src/api/: Contains the mock server setup with db.json for mock data and API configuration.

Routes

- /: Home page with sections for Stores, Books, and Authors.

- /browse-stores: Browse all stores with their book counts and average prices.

- /browse: Browse all books with their authors and store availability.

- /browse-authors: Browse all authors with their published book counts.
