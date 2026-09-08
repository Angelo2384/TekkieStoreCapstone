# 3rd-Party Integrations & RESTful API Guide
**Project:** TekkieStoreCapstone  
**Author:** Lyle Solomons  

---

## 1. Quick Overview

In this project, we use four third-party tools to handle data, media, cloud persistence, and user experience efficiently:

| Tool | Where It Lives | Purpose |
|---|---|---|
| **TiDB Cloud** | Cloud DBaaS (AWS Frankfurt) | Cloud-hosted, distributed MySQL-compatible database providing persistent online storage with TLS encryption so the app is accessible anywhere without a local MySQL daemon. |
| **Cloudinary** | Backend (Spring Boot) | Hosts, optimizes, and delivers shoe photos via global CDN so the database only stores lightweight URL strings. |
| **Axios** | Frontend (React) | Sends HTTP requests (`GET`, `POST`) from React to Spring Boot REST endpoints and automatically parses JSON. |
| **MUI Skeleton** | Frontend (React / Material UI) | Provides animated placeholder skeleton screens (`@mui/material/Skeleton`) during asynchronous cloud fetch requests to improve perceived performance and eliminate Cumulative Layout Shift (CLS). |

---

## 2. Cloudinary Integration (Backend)

- **Official Docs:** [https://cloudinary.com/documentation/java_integration](https://cloudinary.com/documentation/java_integration)
- **GitHub SDK:** [https://github.com/cloudinary/cloudinary_java](https://github.com/cloudinary/cloudinary_java)

### Setup Steps:
1. **Maven Dependency (`pom.xml`):**
   ```xml
   <dependency>
       <groupId>com.cloudinary</groupId>
       <artifactId>cloudinary-http5</artifactId>
       <version>2.0.0</version>
   </dependency>
   ```

2. **Credentials (`application.properties`):**
   ```properties
   cloudinary.cloud-name=nuivwupa
   cloudinary.api-key=477249257479995
   cloudinary.api-secret=sCDDOSxRy3sBcLLhs8bQrtzjAcQ
   ```

3. **Configuration Bean (`CloudinaryConfig.java`):**
   Initializes Cloudinary using the credentials from `application.properties` so Spring can inject it anywhere.
   ```java
   @Bean
   public Cloudinary cloudinary() {
       Map<String, String> config = new HashMap<>();
       config.put("cloud_name", cloudName);
       config.put("api_key", apiKey);
       config.put("api_secret", apiSecret);
       config.put("secure", "true");
       return new Cloudinary(config);
   }
   ```

4. **Service Wrapper (`CloudinaryService.java`):**
   Provides helper methods to upload and delete files. Automatically partitions shoes into brand folders:
   - `uploadImage(MultipartFile, brand)` &rarr; for uploads from the web/browser.
   - `uploadFile(File, brand)` &rarr; for bulk/script uploads from disk.
   - `deleteImage(publicId)` &rarr; removes images from the cloud.

5. **Unit Testing (`CloudinaryServiceTest.java`):**
   Tests live upload functionality and asserts that Cloudinary successfully responds with a valid `https://res.cloudinary.com/...` URL and public ID.

6. **Database Seeder (`DatabaseSeeder.java`):**
   Implements Spring Boot's `CommandLineRunner` to automatically seed MySQL on startup with real sneakers (Adidas, Nike, Puma) and their corresponding live Cloudinary image URLs so `GET /shoe/getAll` returns real data immediately.

---

## 3. Axios Integration (Frontend)

- **Official Docs:** [https://axios-http.com/docs/intro](https://axios-http.com/docs/intro)
- **GitHub Repository:** [https://github.com/axios/axios](https://github.com/axios/axios)

### Why Axios instead of native `fetch()`?
- **Automatic JSON Transformation:** `response.data` is already a parsed JavaScript object (no manual `await res.json()` needed).
- **Centralized Base URL:** Set `baseURL: 'http://localhost:8080'` once, so you don't repeat the full server address across components.
- **Better Error Handling:** Automatically rejects promises and jumps to `catch` on HTTP 4xx/5xx status codes.
- **Timeout Protection:** Cancels requests that hang too long (e.g. 30 seconds for cloud roundtrips).

### Setup Steps:
1. **Install Package (`package.json`):**
   ```bash
   cd frontend
   npm install axios
   ```

2. **Central Client Instance (`src/services/api.ts`):**
   Creates a reusable Axios instance configured to communicate with the Spring Boot server:
   ```typescript
   import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:8080',
     headers: {
       'Content-Type': 'application/json',
     },
     timeout: 30000, // 30s timeout protects against premature connection aborts under cloud database latency
   });

   export default api;
   ```

3. **Data Service Wrapper (`src/services/shoeService.ts`):**
   Defines clean API methods and transforms backend entities into frontend types directly from the database:
   ```typescript
   import api from './api';

   // GET all sneakers
   export const fetchAllShoes = async () => {
     const response = await api.get('/shoe/getAll');
     return response.data;
   };

   // GET shoe by ID
   export const fetchShoeById = async (id: string) => {
     const response = await api.get(`/shoe/read/${id}`);
     return response.data;
   };
   ```

4. **Component Consumption (`CataloguePage.tsx` & `ProductDetails.tsx`):**
   Calls `fetchAllShoes()` inside React's `useEffect()` to render live products and Cloudinary images:
   ```typescript
   useEffect(() => {
     fetchAllShoes().then((shoes) => {
       setAllProducts(shoes);
     });
   }, []);
   ```

5. **CORS Configuration (Backend):**
   Because the React frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:8080`, browsers enforce Cross-Origin Resource Sharing (CORS) security.
   We enabled browser access by configuring CORS in Spring Security / controllers:
   ```java
   @CrossOrigin(origins = "http://localhost:5173")
   @RestController
   @RequestMapping("/shoe")
   public class ShoeController { ... }
   ```

6. **ShoeVariant & Embedded ShoeSize Integration (`src/services/shoeVariantService.ts`):**
   - **Axios for ShoeVariant REST Endpoints:** The React frontend uses the central Axios instance (`api.ts`) to communicate with Spring Boot's `/shoeVariant/**` REST endpoints:
     - `GET /shoeVariant/getAll` &rarr; Fetches all shoe variants.
     - `GET /shoeVariant/read/{id}` &rarr; Fetches a single variant by ID.
     - `POST /shoeVariant/create` &rarr; Creates a new shoe variant.
     - `POST /shoeVariant/update` &rarr; Updates an existing shoe variant.
     - `DELETE /shoeVariant/delete/{id}` &rarr; Deletes a variant by ID.
   - **ShoeSize as Embedded Value Object:** In Spring Boot, `ShoeSize` is an `@Embeddable` JPA value object containing `sizeValue` and `sizeRegion`, rather than an independent relational entity. It does not possess its own repository, service, or `/shoeSize` REST endpoints. Axios requests and responses transmit `ShoeSize` as nested JSON embedded directly inside each `ShoeVariant`:
     ```json
     {
       "variantId": "V001",
       "shoe": {
         "shoeId": "S001"
       },
       "size": {
         "sizeValue": 8.0,
         "sizeRegion": "UK"
       },
       "colour": "Black",
       "stockQuantity": 10
     }
     ```
   - **Product Details Dynamic Filtering:** When a sneaker is viewed on the `ProductDetails` page, variants are fetched via Axios and filtered by matching `variant.shoe.shoeId === currentShoe.shoeId`. The page dynamically displays available sizes, size regions (e.g. UK), colours, and live stock quantities directly from backend records, automatically disabling out-of-stock options (`stockQuantity <= 0`) and preserving the selected `variantId` upon adding to the shopping bag.

---

## 4. TiDB Cloud Serverless Integration (Cloud Database)

- **Official Docs:** [https://docs.pingcap.com/tidbcloud/](https://docs.pingcap.com/tidbcloud/)
- **Spring Boot Guide:** [https://docs.pingcap.com/tidbcloud/integrate-tidb-with-spring-boot](https://docs.pingcap.com/tidbcloud/integrate-tidb-with-spring-boot)
- **MySQL Connector/J Guide:** [https://dev.mysql.com/doc/connector-j/en/](https://dev.mysql.com/doc/connector-j/en/)

### Why TiDB Cloud Serverless?
- **100% MySQL Protocol Compatibility:** TiDB speaks the native MySQL 8.0 wire protocol. Our existing `com.mysql:mysql-connector-j` driver, Spring Data JPA repositories, entity relationships, and queries worked out of the box with zero Java code changes.
- **Cloud-Native & Distributed:** Eliminates dependence on `localhost:3306`. Team members and deployed frontend clients can query and mutate real cloud data from anywhere.
- **High Availability & Auto-Scaling:** Hosted on AWS Frankfurt (`eu-central-1`) with built-in replication, automated backups, and serverless compute scaling.
- **Enterprise-Grade Transport Security:** Enforces TLS 1.2/1.3 encryption across all database traffic over the public internet.

### Setup Steps:
1. **Cluster Provisioning:**
   Created a free Serverless cluster instance (`tekkiestore-db`) hosted on AWS Frankfurt (`eu-central-1`) via the TiDB Cloud Console.

2. **Database Initialization:**
   Executed schema creation via TiDB Chat2Query / SQL Editor:
   ```sql
   CREATE DATABASE tekkiestore_db;
   ```

3. **DataSource Configuration (`backend/src/main/resources/application.properties`):**
   Configured Spring Boot's HikariCP connection pool with the remote gateway and identity verification:
   ```properties
   spring.datasource.url=jdbc:mysql://gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/tekkiestore_db?sslMode=VERIFY_IDENTITY&useUnicode=true&characterEncoding=utf8
   spring.datasource.username=2Hq9uUcv1XQhb1H.root
   spring.datasource.password=kaWqFVCZevV4uOoM
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

   spring.jpa.hibernate.ddl-auto=update
   ```

4. **Automated Schema Provisioning (Hibernate ORM):**
   With `spring.jpa.hibernate.ddl-auto=update`, Hibernate scans our `@Entity` models (`Shoe`, `ShoeVariant`, `Customer`, `Cart`, `Order`, etc.) and automatically generates all relational tables, foreign key constraints, and indexes in `tekkiestore_db` upon startup.

5. **Automated Cloud Seeding (`DatabaseSeeder.java`):**
   Spring Boot's `DatabaseSeeder` detects an empty database on first boot (`count == 0`) and automatically seeds all 45+ sneakers with live Cloudinary image URLs directly into TiDB Cloud.

6. **Remote Cloud Latency Optimization (The N+1 Query & `JOIN FETCH` Solution):**
   - **The Challenge with Cloud DBaaS:** Connecting to a remote database in the cloud (AWS Frankfurt) introduces network latency (~150ms round trip per query) that does not exist on `localhost:3306`.
   - **The Problem (N+1 Queries):** The `Shoe` entity stores multiple Cloudinary image URLs in an `@ElementCollection`. By default, Spring Data JPA executes 1 query to fetch the shoes and then 45 separate queries across the internet to fetch each shoe's image URLs (the classic **N+1 query problem**). This took over 13 seconds and caused the frontend Axios client to hit its timeout and abort the connection (`An established connection was aborted by the software in your host machine`).
   - **The Standard Solution (`ShoeRepository.java`):**
     We defined a standard JPQL `LEFT JOIN FETCH` query on the repository:
     ```java
     @Repository
     public interface ShoeRepository extends JpaRepository<Shoe, String> {

         // Fetches all shoes and their image URLs in ONE single SQL JOIN query
         @Query("SELECT DISTINCT s FROM Shoe s LEFT JOIN FETCH s.imageUrls")
         @Override
         List<Shoe> findAll();

         // Fetches a single shoe and its images in ONE single SQL JOIN query
         @Query("SELECT s FROM Shoe s LEFT JOIN FETCH s.imageUrls WHERE s.shoeId = :id")
         @Override
         Optional<Shoe> findById(@Param("id") String id);
     }
     ```
     Hibernate now executes **one single SQL JOIN query** instead of 46 round trips. Database response time dropped from ~13.3s to ~300ms.
   - **Where We Found This Solution (Videos, Websites & Documentation):**
     - 🎥 **YouTube Tutorial:** [Thorben Janssen: "JOIN FETCH with Hibernate - The end of n+1 select issues"](https://www.youtube.com/results?search_query=thorben+janssen+join+fetch+hibernate+n%2B1) *(Java Champion Thorben Janssen demonstrates how Hibernate executes N+1 select queries and how `JOIN FETCH` forces a single SQL query).*
     - 🎥 **YouTube / Devoxx Conference Talk:** [Devoxx: "The best way to fetch associations with JPA and Hibernate"](https://www.youtube.com/results?search_query=devoxx+the+best+way+to+fetch+associations+with+jpa+and+hibernate) *(Deep dive on performance pitfalls in ORM mapping).*
     - 🌐 **Baeldung Tutorial:** [Baeldung: How to Solve the N+1 Problem in Hibernate](https://www.baeldung.com/hibernate-n1-queries) *(Comprehensive written guide detailing how to identify and eliminate N+1 queries using JPQL).*
     - 🌐 **Baeldung Tutorial:** [Baeldung: JPA Join Fetch vs Join](https://www.baeldung.com/jpa-join-vs-join-fetch) *(Explains the technical difference between an inner join and a fetch join).*
     - 🌐 **Vlad Mihalcea (Hibernate Core Contributor):** [The best way to solve the N+1 query problem with Hibernate](https://vladmihalcea.com/n-plus-1-query-problem/) *(Technical breakdown on optimizing collection fetching).*
     - 📚 **Spring Official Documentation:** [Spring Data JPA Reference: Defining Query Methods with @Query](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html#jpa.query-methods.at-query) *(Official Spring documentation on overriding repository methods with JPQL).*
     - 💬 **Stack Overflow Discussion:** [Stack Overflow: "An established connection was aborted by the software in your host machine" in Spring Boot](https://stackoverflow.com/questions/28664064/an-established-connection-was-aborted-by-the-software-in-your-host-machine) *(Explains that Windows WSAECONNABORTED error code 10053 occurs when the HTTP client disconnects while the server is writing output).*

7. **Shoe Image Ordering (Main Photo Guarantee):**
   - **The Problem:** In MySQL / TiDB, the `shoe_images` table stores photos without any automatic order. For sneakers with multiple photos (like Nike P-6000 or Air Max 90), MySQL sometimes returned the back angle (`_3.jpg`) first instead of the main front photo (`shoe.jpg`). This made the catalogue display the wrong angle.
   - **The Simple Solution:**
     1. **Frontend (`src/services/shoeService.ts`):** Added a simple `sortShoeImages()` helper. It checks if an image has `_2` or `_3` in its filename. If it does not, it's the main photo and is kept at index 0.
     2. **Backend (`Shoe.java`):** Added `@OrderBy` to the `imageUrls` list so Hibernate also asks the database to sort image records.

---

## 5. Component Libraries & Material UI (MUI) Skeleton (Frontend UI/UX)

- **Official Skeleton Docs:** [https://mui.com/material-ui/react-skeleton/](https://mui.com/material-ui/react-skeleton/)
- **MUI Component Catalog:** [https://mui.com/material-ui/all-components/](https://mui.com/material-ui/all-components/)
- **NPM Package:** `@mui/material` (with peer dependencies `@emotion/react` and `@emotion/styled`)
- **GitHub Repository:** [https://github.com/mui/material-ui](https://github.com/mui/material-ui)

### What is a Component Library?
In React, everything on screen is composed of **components** (reusable pieces of UI like buttons, cards, dialogs, and loaders).
* **Without a component library:** Developers must write custom HTML (`<div>`), hundreds of lines of complex CSS (keyframes, responsive breakpoints, flexbox/grid), and manual JavaScript state handlers from scratch for every widget.
* **With a component library:** Professional teams (like Google, Material UI, or open-source foundations) design, test, optimize, and publish pre-built, accessible components as an **npm package**. You simply install the package, import the desired component, and customize its appearance using **props** (properties).

### The Standard 4-Step Workflow for ANY Component Library:
1. **Browse the Documentation:** Visit the library's website (e.g., [mui.com](https://mui.com/)) to find the component you need and preview interactive code examples.
2. **Install via npm:** Run `npm install <package-name>` inside the `frontend` directory.
3. **Import into your React file:** Use named imports at the top of your component (e.g., `import Skeleton from '@mui/material/Skeleton';`).
4. **Configure with Props:** Pass properties to control size, shape, animation, and behavior (e.g., `variant="rounded" animation="wave"`).

### Why MUI Skeleton instead of generic spinners or blank screens?
1. **Industry-Standard Component:** Material UI is the benchmark React UI component library used across enterprise web applications, built according to Google Material Design standards.
2. **Superior Perceived Performance:** Rather than presenting a blank screen or a generic spinning wheel, skeleton screens render the exact visual shape and layout of incoming shoe cards, images, titles, and buttons. This provides instant visual feedback and makes the application feel significantly faster.
3. **Eliminates Cumulative Layout Shift (CLS):** Pre-allocating exact dimensions (e.g. 300px card heights, 500px main gallery image) prevents sudden layout jumping and page reflow when cloud images and product data finish loading.
4. **Prevents Premature "Not Found" Flashes:** On the `ProductDetails` page, asynchronous database queries take a fraction of a second over the cloud. Showing a skeleton layout during this brief transition prevents the UI from prematurely flashing a false "Product Not Found" screen before data arrives.

### Setup Steps:
1. **Install Packages (`package.json`):**
   ```bash
   cd frontend
   npm install @mui/material @emotion/react @emotion/styled
   ```

2. **Trending Section Skeletons (`src/components/home/TrendingSection.tsx`):**
   When the homepage mounts, 4 animated skeleton cards render while the database query is in flight:
   ```tsx
   import Skeleton from '@mui/material/Skeleton';

   {loading ? (
     Array.from({ length: 4 }).map((_, idx) => (
       <div key={idx} className="product-card" aria-hidden="true">
         {/* 1. Rounded rectangle matching the 300px shoe image */}
         <Skeleton
           variant="rounded"       // Shape: "text" | "circular" | "rectangular" | "rounded"
           width="100%"            // Takes full container width
           height={300}            // Exact height of the product image
           animation="wave"        // Options: "wave" (shimmer across) | "pulse" (fade in/out) | false
           sx={{ borderRadius: '12px', mb: 2 }} // 'sx' is MUI's theme styling prop
         />
         {/* 2. Text lines matching brand, title, and price tags */}
         <div className="product-info">
           <Skeleton variant="text" width="35%" height={16} animation="wave" />
           <Skeleton variant="text" width="75%" height={24} animation="wave" />
           <Skeleton variant="text" width="40%" height={20} animation="wave" />
         </div>
       </div>
     ))
   ) : ...}
   ```

3. **Catalogue Grid Skeletons (`src/pages/CataloguePage.tsx`):**
   Renders a 6-card placeholder grid (`<Skeleton variant="rounded" height={280} />`) that accurately mirrors the responsive product catalogue cards until cloud data is received.

4. **Product Details Two-Column Skeleton (`src/pages/ProductDetails.tsx`):**
   Renders a 500px hero image skeleton, 3 thumbnail placeholders (85x85px), brand, title, pricing badges, and button shapes during initial load, ensuring a seamless transition to the full product view.

### Popular Component Libraries Reference Directory
| Library | Website | Best Use Cases |
|---|---|---|
| **Material UI (MUI)** | [https://mui.com/](https://mui.com/) | Enterprise web apps, comprehensive component catalogue (Skeletons, Badges, Modals, Drawers). |
| **Lucide Icons** | [https://lucide.dev/](https://lucide.dev/) | Clean, lightweight SVG icon components (used in TekkieStore for shopping cart, search, trash, arrows). |
| **Chakra UI** | [https://chakra-ui.com/](https://chakra-ui.com/) | Accessible, modular components with flexible prop-based styling. |
| **Shadcn UI** | [https://ui.shadcn.com/](https://ui.shadcn.com/) | Copy-paste Tailwind components that you directly control in your source tree. |

---

## 6. Presentation Cheatsheet (Quick Talking Points)

**Q: Why use Cloudinary instead of saving images in MySQL?**  
> *"Storing binary images in MySQL bloats the database and slows down queries. Storing URLs in MySQL while Cloudinary hosts the images gives us fast CDN delivery and zero database strain."*

**Q: Why use Axios instead of native `fetch()`?**  
> *"Axios simplifies API calls with automatic JSON transformation, centralized base URLs, configurable timeouts, and cleaner promise error handling."*

**Q: Why did you migrate the database to TiDB Cloud instead of keeping it on localhost (`localhost:3306`)?**  
> *"Localhost databases tie the project to a single machine. TiDB Cloud Serverless provides a cloud-native DBaaS hosted on AWS Frankfurt. It gives our entire team a single source of truth, supports remote deployments, and guarantees high availability without maintaining local MySQL server daemons."*

**Q: Did you have to rewrite your repositories or queries to support TiDB Cloud?**  
> *"No. Because TiDB is 100% MySQL 8.0 protocol-compatible and our application uses Spring Data JPA / Hibernate, the persistence layer is database-agnostic. We only updated our JDBC connection string with `sslMode=VERIFY_IDENTITY` in `application.properties`."*

**Q: What is the N+1 query problem, and how did you resolve it after migrating to TiDB Cloud?**  
> *"On a local database, latency is negligible, but with a remote cloud database (AWS Frankfurt), every round trip incurs network travel time. When fetching shoes, Hibernate initially sent 1 query to get the shoes and then 45 separate queries to fetch the image collection for each shoe (N+1 queries), taking over 13 seconds. We resolved this by adding a standard JPQL `LEFT JOIN FETCH` query to `ShoeRepository`, which instructs Hibernate to fetch all shoes and images in a single SQL JOIN query in under half a second."*

**Q: Why did you experience "connection was aborted by the software in your host machine" and how was it solved?**  
> *"Axios had a 10-second timeout. Because the unoptimized remote queries took 13+ seconds, Axios terminated the request at 10 seconds. When Spring Boot finished and attempted to stream the JSON to Tomcat, the socket was already closed by the client. We solved it by optimizing `ShoeRepository` to 1 query with `JOIN FETCH` (300ms) and adjusting the Axios timeout to 30 seconds (`timeout: 30000`) in `api.ts`."*

**Q: Why use Material UI Skeletons instead of a standard spinning loading circle?**  
> *"Spinning wheels offer no visual preview of content and cause sudden layout jumping (Cumulative Layout Shift) once data loads. Skeletons from Material UI (`@mui/material/Skeleton`) provide visual wireframes of the upcoming sneaker cards, giving the user immediate visual feedback and significantly improving perceived speed."*

**Q: How is security handled when connecting to the cloud database over the internet?**  
> *"All database traffic is encrypted in transit using TLS 1.2/1.3. We configured `sslMode=VERIFY_IDENTITY` in our JDBC URL, which forces the MySQL driver to cryptographically verify the server's TLS certificate against trusted AWS Certificate Authorities, preventing man-in-the-middle attacks."*

**Q: How is this a RESTful integration?**  
> *"The backend exposes stateless HTTP endpoints (`GET /shoe/getAll`, `POST /shoe/create`). The frontend consumes these via Axios, receiving JSON responses with product data and Cloudinary image links."*

**Q: How did you organize your cloud folders and handle genders (Men, Women, Kids)?**  
> *"We structured folders as `shoes/<brand>/` (e.g. `shoes/adidas/`). Gender is stored as a column in MySQL rather than hardcoded into folder paths, which prevents duplicate photo uploads for unisex shoes and keeps the cloud clean for future additions like `accessories/<brand>/`."*

**Q: How did you optimize image load times for large (7MB–10MB) raw photos?**  
> *"We utilized Cloudinary's dynamic on-the-fly transformations (`f_auto,q_auto,w_800`). Cloudinary automatically compresses the image, converts it into modern WebP format, and resizes it to 800px on their global CDN, shrinking file sizes by over 95% for instant page loads."*

**Q: How are sale prices and sale percentages handled across the application?**  
> *"The database `shoe` entity stores both `sale_price` and `sale_percentage`. When a sale percentage is applied (e.g. 20%), the discounted price is calculated and persisted in MySQL. In the frontend, on-sale shoes display a badge (`-20% OFF`), a strikethrough original price, and are filterable through a dedicated `/sale` route. The shopping cart automatically charges the discounted price upon checkout."*

---

## 7. Cart Axios Integration (Frontend ↔ Backend)

This section documents the Axios-based cart integration that connects the React frontend shopping cart to the Spring Boot backend. Cart state is persisted to the database for authenticated users while remaining functional locally for all users.

---

### 7.1 Files Created or Changed

| File | Role |
|---|---|
| `frontend/src/services/cartService.ts` | **Created.** Dedicated Axios service wrapping all cart and cart item REST endpoints. |
| `frontend/src/services/api.ts` | **Reused (unchanged).** Central Axios instance consumed by `cartService.ts`. No duplicate configuration was created. |
| `frontend/src/context/CartContext.tsx` | **Modified.** Cart state management updated to synchronize with the Spring Boot backend via `cartService.ts`. |
| `frontend/src/pages/CartPage.tsx` | **Existing page.** Cart UI was not restructured; it consumes `CartContext` as before. |

---

### 7.2 Axios Integration

The cart integration reuses the existing central Axios instance defined in `frontend/src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});
```

- **Backend base URL:** `http://localhost:8080`
- **Communication:** All cart Axios requests are made from the React frontend to the Spring Boot REST API over HTTP.
- **JWT headers:** The existing request interceptor in `api.ts` automatically attaches the `Authorization: Bearer <token>` header from `localStorage` (`tekkie_token`) to every outgoing request. `cartService.ts` does not manage tokens directly — it inherits authentication from the shared instance.
- **No duplication:** A second Axios instance was not created. `cartService.ts` imports and reuses `api` directly.

---

### 7.3 Cart Backend Endpoints

All endpoints listed below are actually called by the frontend cart implementation.

**Cart (`/cart`)**

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/cart/read/{id}` | Retrieve a cart by its ID |
| `POST` | `/cart/create` | Create a new cart record |
| `POST` | `/cart/update` | Update an existing cart (total amount) |
| `DELETE` | `/cart/delete/{id}` | Delete a cart by ID |

**Cart Items (`/cartitem`)**

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/cartitem/getAll` | Retrieve all cart item records |
| `GET` | `/cartitem/read/{id}` | Retrieve a single cart item by ID |
| `POST` | `/cartitem/create` | Create a new cart item |
| `POST` | `/cartitem/update` | Update an existing cart item (quantity, subtotal) |
| `DELETE` | `/cartitem/delete/{id}` | Delete a cart item by ID |

> Spring Boot controllers: `CartController.java` and `CartItemController.java`.

---

### 7.4 Cart Service (`cartService.ts`)

`frontend/src/services/cartService.ts` is a dedicated service module that wraps all cart-related Axios calls. It exports a `cartService` object with the following functions:

**Cart functions:**

| Function | Axios Request | Purpose |
|---|---|---|
| `getCart(cartId)` | `GET /cart/read/{id}` | Retrieve a cart by ID. Returns `null` on failure. |
| `createCart(cart)` | `POST /cart/create` | Create a new cart entity. |
| `updateCart(cart)` | `POST /cart/update` | Update cart total. Falls back to `createCart` if the cart does not yet exist. |
| `deleteCart(cartId)` | `DELETE /cart/delete/{id}` | Delete a cart. Returns `false` on failure. |

**Cart item functions:**

| Function | Axios Request | Purpose |
|---|---|---|
| `getAllCartItems()` | `GET /cartitem/getAll` | Retrieve all cart items. Returns `[]` on failure. |
| `getCartItem(cartItemId)` | `GET /cartitem/read/{id}` | Retrieve a single cart item. Returns `null` on failure. |
| `createCartItem(cartItem)` | `POST /cartitem/create` | Create a new cart item. |
| `updateCartItem(cartItem)` | `POST /cartitem/update` | Update a cart item. Falls back to `createCartItem` if the item does not yet exist. |
| `deleteCartItem(cartItemId)` | `DELETE /cartitem/delete/{id}` | Delete a cart item. Returns `false` on failure. |

**TypeScript interfaces exported by `cartService.ts`:**

```typescript
export interface BackendCart {
  cartId: string;
  totalAmount: number;
}

export interface BackendCartItem {
  cartItemId: string;
  cart?: { cartId: string; totalAmount?: number } | null;
  shoe?: BackendShoeRef | null;
  shoeVariant?: BackendShoeVariantRef | null;
  shoeSize?: BackendShoeSize | null;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}
```

---

### 7.5 Cart State Synchronization (`CartContext.tsx`)

`CartContext.tsx` manages cart state for the entire application and synchronizes it with the Spring Boot backend for authenticated users. The cart also persists locally in `localStorage` under the key `tekkie_store_cart` for resilience.

**Cart item ID scheme:**  
Each cart item is identified on the backend using a collision-safe UUID (`cartItemId`).

**`refreshCart()`:**  
On authentication, `refreshCart()` is called automatically. It:
1. Calls `getCart(userCartId)` to check if a backend cart exists.
2. Calls `getAllCartItems()` to retrieve backend items.
3. If backend items exist, they are merged into the local cart state, restoring backend quantities and synchronizing connected `shoeVariant` and `shoeSize` data.
4. If local items are missing on the backend, they are pushed to Spring Boot via `createCartItem` and `updateCart`.

**`addToCart(product, size, quantity, variant)`:**  
1. Updates local state immediately for instant UI feedback, recording `variantId`, `shoeSize`, and `colour`.
2. Calls `updateCart(...)` to ensure the parent cart exists and has the new total.
3. Sends `cartService.createCartItem(...)` or `updateCartItem(...)` containing the complete connection payload (`cart`, `shoe`, `shoeVariant`, `shoeSize`, `quantity`, `unitPrice`, `subTotal`).

**`updateQuantity(cartId, quantity)`:**  
1. Updates local state.
2. Calls `updateCartItem(...)` with the new quantity, recalculated subtotal, and connected entity references.
3. Recalculates the full cart total and calls `updateCart(...)`.

**`removeFromCart(cartId)`:**  
1. Removes the item from local state.
2. Calls `deleteCartItem(cartItemId)`.
3. Recalculates the cart total and calls `updateCart(...)`.

**`clearCart()`:**  
1. Clears local state to `[]`.
2. Iterates over all previous items and calls `deleteCartItem` for each.
3. Calls `updateCart(...)` with `totalAmount: 0`.

**Cart count:**  
`cartCount` is a `useMemo` derived value — the sum of all item quantities — consumed by the navigation bar to display a live item count badge.

---

### 7.6 Authentication and Axios Cart Requests

Authentication directly affects which Axios cart requests are permitted.

- **Unauthenticated users:** `addToCart` immediately redirects to `/login` and returns `false` before any Axios request is made. No cart data is sent to the backend.
- **Authenticated users:** Cart changes (add, update, remove, clear) are persisted to the Spring Boot backend via Axios.
- **Token attachment:** The JWT Bearer token is attached to all Axios requests automatically by the `api.ts` request interceptor, including cart requests.
- **401/403 handling:** If any cart Axios request receives a `401 Unauthorized` or `403 Forbidden` response, `CartContext` calls `logout()` and redirects to `/login`, consistent with the existing authentication system.

---

### 7.7 Cart Calculations

Pricing logic in `CartContext.tsx` accounts for sale prices:

| Value | Calculation |
|---|---|
| **Effective unit price** | `product.salePrice` if `product.isOnSale && product.salePrice`, otherwise `product.price` |
| **Line subtotal** | `effectiveUnitPrice × quantity` |
| **Cart total** | Sum of all line subtotals (`cartTotal` via `useMemo`) |
| **Backend `subTotal`** | Sent to Spring Boot as `unitPrice × quantity` per cart item |
| **Backend `totalAmount`** | Sent to Spring Boot as the recalculated full cart total on every mutation |

Shipping is not calculated in `CartContext.tsx`.

---

### 7.8 Error Handling

| Scenario | Handling |
|---|---|
| Backend cart/item request fails | Wrapped in `try/catch`; a warning is logged to the console (`console.warn`). Local cart state is unaffected. |
| `getCart` / `getAllCartItems` fails | Returns `null` or `[]` gracefully; the local cart continues to function. |
| `createCart` / `createCartItem` fails | Exception propagates to the caller's `catch` block in `CartContext`. |
| `updateCart` / `updateCartItem` fails | Falls back to the corresponding `create` call inside `cartService.ts`. |
| `deleteCartItem` fails | Returns `false`; warning logged. |
| Network timeout | Axios cancels the request after 10 000 ms (set in `api.ts`). |
| `401` / `403` response | `CartContext` calls `logout()` and navigates to `/login`. |
| `isLoading` state | Set to `true` during `refreshCart()` and `false` on completion. Consumers can render loading indicators. |
| `error` state | A user-facing string `'Unable to synchronize cart with the server. Local cart remains active.'` is set on `refreshCart` failure for non-auth errors. |

The local cart stored in `localStorage` acts as a fallback — if any backend call fails, the user's cart items remain visible and usable in the UI.

---

### 7.9 CartItem Relationships (Cart, Shoe, ShoeVariant & ShoeSize)

To ensure full persistence of customer selections, `CartItem` connects directly with `Cart`, `Shoe`, `ShoeVariant`, and `ShoeSize`:

1. **`cart` (`@ManyToOne` &rarr; `Cart`):** Links each line item to its parent cart via `cart_id` foreign key.
2. **`shoe` (`@ManyToOne` &rarr; `Shoe`):** Links each line item to the base shoe catalog entity via `shoe_id` foreign key.
3. **`shoeVariant` (`@ManyToOne` &rarr; `ShoeVariant`):** Identifies the exact shoe variant chosen by the user (specific SKU/colorway/stock record) via `variant_id` foreign key.
4. **`shoeSize` (`@Embedded` &rarr; `ShoeSize`):** Embeds the value object containing numeric `sizeValue` (e.g. `8.0`) and regional standard `sizeRegion` (e.g. `'UK'`).
5. **Serialization:** All `@ManyToOne` associations specify `@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})` to prevent Hibernate proxy serialization errors when sending JSON back over Axios.

**Axios Request Payload (`POST /cartitem/create` & `POST /cartitem/update`):**
```json
{
  "cartItemId": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  "cart": { "cartId": "cart_marcus" },
  "shoe": { "shoeId": "S001" },
  "shoeVariant": { "variantId": "V001" },
  "shoeSize": { "sizeValue": 8.0, "sizeRegion": "UK" },
  "quantity": 1,
  "unitPrice": 2499.0,
  "subTotal": 2499.0
}
```

---

### 7.10 Code References

| Source | Used For |
|---|---|
| `backend/src/main/java/za/ac/cput/tekkiestorecapstone/domain/CartItem.java` | JPA entity connecting `cartItemId`, `cart`, `shoe`, `shoeVariant`, `shoeSize`, `quantity`, `unitPrice`, `subTotal`. |
| `backend/src/main/java/za/ac/cput/tekkiestorecapstone/factory/CartItemFactory.java` | Factory method creating `CartItem` instances with connected `Cart`, `Shoe`, `ShoeVariant`, and `ShoeSize`. |
| `backend/src/main/java/za/ac/cput/tekkiestorecapstone/repository/CartItemRepository.java` | Spring Data JPA repository with `findByCart_CartId` and `findByShoe_ShoeId` queries. |
| `backend/src/main/java/za/ac/cput/tekkiestorecapstone/controller/CartItemController.java` | REST endpoints for cart item CRUD (`/cartitem/create`, `/update`, `/delete`, `/cart/{cartId}`). |
| `frontend/src/services/api.ts` | Central Axios instance configured with base URL `http://localhost:8080` and JWT auth interceptor. |
| `frontend/src/services/cartService.ts` | Axios wrapper with updated `BackendCartItem` interface including `cart`, `shoe`, `shoeVariant`, `shoeSize`. |
| `frontend/src/context/CartContext.tsx` | Manages cart state and transmits connected relationships via Axios during `addToCart`, `updateQuantity`, and `refreshCart`. |
| `frontend/src/pages/CartPage.tsx` | User-facing shopping cart page rendering `CartItemCard` components. |
| Axios official documentation | [https://axios-http.com/docs/intro](https://axios-http.com/docs/intro) |


---

## 8. ShoeVariant & ShoeSize — Product Details Integration (Axios)

### 8.1 Overview

The **Product Details** page (`ProductDetails.tsx`) retrieves shoe size and stock data from the Spring Boot API using Axios. Each `ShoeVariant` contains an `@Embedded ShoeSize` value object — `ShoeSize` is **not** a standalone entity and has no separate REST endpoints.

### 8.2 Data Flow

```
/product/{shoeId}
      ↓
ProductDetails.tsx
      ↓  (Axios GET)
shoeVariantService.getVariantsByShoeId(shoeId)
      ↓
GET /shoeVariant/shoe/{shoeId}
      ↓
ShoeVariantController
      ↓
ShoeVariantService.getVariantsByShoeId(shoeId)
      ↓
ShoeVariantRepository.findByShoe_ShoeId(shoeId)   ← Spring Data JPA derived query
      ↓
shoe_variant table (TiDB Cloud)
      ↓
List<ShoeVariant> JSON (ShoeSize embedded as nested object)
      ↓
ProductInfo.tsx → Colour + Size grid + live stock displayed
```

### 8.3 Backend Endpoint

| Method | Path | Description |
|---|---|---|
| `GET` | `/shoeVariant/shoe/{shoeId}` | Returns all `ShoeVariant` rows whose `shoe_id` FK matches `{shoeId}`. Returns `[]` when none exist. |

**Example response:**
```json
[
  {
    "variantId": "V001",
    "shoe": { "shoeId": "S001" },
    "size": { "sizeValue": 7.0, "sizeRegion": "UK" },
    "colour": "Black",
    "stockQuantity": 10
  }
]
```

> `ShoeSize` is serialized inline as a nested JSON object because it is an `@Embeddable` value object stored in the same database row as `ShoeVariant`.

### 8.4 Serialization Notes

- `ShoeVariant.shoe` is a `@ManyToOne(fetch = FetchType.LAZY)` relationship.
- `@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "variants"})` is applied to the `shoe` field to prevent Hibernate proxy serialization errors and avoid circular recursion.

### 8.5 Frontend Service

**File:** `frontend/src/services/shoeVariantService.ts`

```ts
getVariantsByShoeId: async (shoeId: string): Promise<ShoeVariant[]> => {
  const response = await api.get<ShoeVariant[]>(
    `/shoeVariant/shoe/${encodeURIComponent(shoeId)}`
  );
  return Array.isArray(response.data) ? response.data : [];
}
```

Errors are **not caught** in this method — they propagate so `ProductDetails` can distinguish:
- API error → `variantsError = true` → user sees "Unable to retrieve live sizing…"
- Empty array → `variants = []` → user sees "No shoe size variants registered…"
- Populated array → sizes and colours rendered in `ProductInfo`

### 8.6 Frontend Types

**File:** `frontend/src/types/shoeVariant.ts`

```ts
export interface ShoeSize {
  sizeValue: number;
  sizeRegion: string;
}

export interface ShoeVariant {
  variantId: string;
  shoe?: { shoeId: string } | null;
  size: ShoeSize;
  colour: string;
  stockQuantity: number;
}
```

### 8.7 ProductInfo Rendering Rules

| Condition | UI Behaviour |
|---|---|
| `variantsLoading === true` | Skeleton placeholders shown in size grid |
| `variantsError === true` | Alert: "Unable to retrieve live sizing and stock from server" |
| `variants.length === 0` | "No shoe size variants are currently registered…" |
| `variants.length > 0` | Size buttons rendered per colour; disabled if `stockQuantity === 0` |
| `stockQuantity === 0` | Size button disabled, "out-of-stock" CSS class applied |
| `stockQuantity > 0` | Size button enabled and selectable |

Add to Cart and Buy Now are disabled until a valid in-stock size is selected.

### 8.8 Code References

| Source | Used For |
|---|---|
| `frontend/src/services/shoeVariantService.ts` | Axios calls to `/shoeVariant/*` endpoints |
| `frontend/src/types/shoeVariant.ts` | TypeScript interfaces for `ShoeVariant` and `ShoeSize` |
| `frontend/src/pages/ProductDetails.tsx` | Fetches variants on mount; stores in `variants` state |
| `frontend/src/components/product/ProductInfo.tsx` | Renders colour/size grid and stock status from variant data |
| `ShoeVariantController.java` | Spring Boot REST controller exposing `/shoeVariant/shoe/{shoeId}` |
| `ShoeVariantService.java` | Delegates to `ShoeVariantRepository.findByShoe_ShoeId` |
| `ShoeVariantRepository.java` | Spring Data JPA derived query: `findByShoe_ShoeId(String shoeId)` |
| `ShoeVariant.java` | JPA entity with `@ManyToOne` to `Shoe` and `@Embedded ShoeSize` |
| `ShoeSize.java` | `@Embeddable` value object: `sizeValue` + `sizeRegion` |

---

## 9. Order / OrderItem Backend Cleanup & Architecture Alignment

This section documents the cleanup of the backend `Order`, `OrderItem`, and `OrderStatus` components. The objective of this phase was strictly to ensure code correctness, safety, test coverage, and documentation without prematurely redesigning the order system, inventing relationship mappings, or implementing final checkout/order business logic.

---

### 9.1 Overview & Scope Boundaries

To maintain clean and explainable academic code, the following boundaries were strictly respected:
- **No over-engineering:** No unnecessary DTO layers, mapper classes, custom exception hierarchies, response wrappers, or Lombok were introduced.
- **Preserved architecture:** Kept the straightforward `Controller -> Service -> JpaRepository` pattern already utilized across the project (e.g. `Cart` and `Customer`).
- **No premature relationship logic:** Relationships between `Order` and `OrderItem`, `Order` and `Customer`, `Order` and `DeliveryDetails`, or `OrderItem` and `Shoe`/`ShoeVariant` were intentionally deferred to the subsequent stage.
- **No checkout workflow implementation:** The frontend React context (`OrderContext.tsx`) continues its existing local storage operations until backend workflows are explicitly defined in the next step.

---

### 9.2 Backend Files Changed & Provenance References

Every backend change made during this cleanup is detailed below, clearly identifying whether the pattern originated from project code, official framework documentation, or standard library conventions.

#### 1. OrderFactory.java
- **File Path:** `backend/src/main/java/za/ac/cput/tekkiestorecapstone/factory/OrderFactory.java`
- **What Changed:** 
  - Updated `createOrder` so newly constructed `Order` objects default to `OrderStatus.PENDING`.
  - Added an overload accepting `OrderStatus status` that safely falls back to `OrderStatus.PENDING` if a `null` status is provided.
- **Why It Changed:** Previously, `createOrder` did not call `.setStatus(...)` on `Order.Builder`, resulting in `status = null` on all factory-instantiated orders.
- **Problem Fixed:** Eliminates null pointer risks and database column nullability issues for order status.
- **Implementation:** Simple fallback check `(status == null) ? OrderStatus.PENDING : status` directly in `OrderFactory`. No separate status resolver or helper class was created.
- **Pattern / Source Reference:**
  - *Project reference / existing implementation pattern:* `backend/src/main/java/za/ac/cput/tekkiestorecapstone/domain/Order.java` (reuses the inner `Order.Builder`).
  - *Framework documentation:* [Jakarta Persistence Enum Mapping](https://jakarta.ee/specifications/persistence/) (for mapping enumerated status).

#### 2. OrderItemFactory.java
- **File Path:** `backend/src/main/java/za/ac/cput/tekkiestorecapstone/factory/OrderItemFactory.java`
- **What Changed:** 
  - Removed the redundant 4th parameter (`double subTotal`) from `createOrderItem(String orderItemId, int quantity, double unitPrice)`.
  - Subtotal is computed internally as `quantity * unitPrice`.
- **Why It Changed:** The factory previously accepted `subTotal` from the caller but ignored it and calculated `quantity * unitPrice`, allowing callers to pass conflicting or misleading values.
- **Problem Fixed:** Guarantees a single source of truth for line-item calculations and prevents data inconsistency.
- **Implementation:** Directly assigned `.setSubTotal(quantity * unitPrice)` inside the existing factory method.
- **Pattern / Source Reference:**
  - *Project reference / existing implementation pattern:* `backend/src/main/java/za/ac/cput/tekkiestorecapstone/domain/OrderItem.java` (reuses `OrderItem.Builder`).
  - *Project reference:* `backend/src/main/java/za/ac/cput/tekkiestorecapstone/factory/CartItemFactory.java` (similar arithmetic pattern for cart line items).

#### 3. OrderService.java
- **File Path:** `backend/src/main/java/za/ac/cput/tekkiestorecapstone/service/OrderService.java`
- **What Changed:** 
  - Improved `delete(String id)`: now performs `if (id == null || !this.repo.existsById(id)) { return false; }` before calling `deleteById(id)`.
  - Improved `update(Order order)`: performs `if (order == null || order.getOrderId() == null || !this.repo.existsById(order.getOrderId())) { return null; }` before `save(order)`.
- **Why It Changed:** Previously, `delete` invoked `repo.deleteById(id)` unconditionally and returned `true`, even if the entity did not exist. Furthermore, calling `save` on an entity whose ID does not exist in an update operation could create an unwanted new record.
- **Problem Fixed:** Accurately reports deletion success/failure and ensures update operations only apply to existing database records.
- **Implementation:** Uses basic `existsById(id)` checks provided out-of-the-box by Spring Data JPA.
- **Pattern / Source Reference:**
  - *Project reference / existing implementation pattern:* `backend/src/main/java/za/ac/cput/tekkiestorecapstone/service/IService.java` and `CartService.java`.
  - *Official documentation:* [Spring Data JPA CrudRepository.existsById](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html).

#### 4. OrderItemService.java
- **File Path:** `backend/src/main/java/za/ac/cput/tekkiestorecapstone/service/OrderItemService.java`
- **What Changed:** 
  - Improved `delete(String id)`: checks `if (id == null || !this.repo.existsById(id)) { return false; }` before deleting.
  - Improved `update(OrderItem orderItem)`: checks `if (orderItem == null || orderItem.getOrderItemId() == null || !this.repo.existsById(orderItem.getOrderItemId())) { return null; }` before saving.
- **Why It Changed:** Same issue as `OrderService`: prevented false-positive deletion returns and unintended creation during update calls.
- **Problem Fixed:** Consistent return contract for `delete` (returns `false` if not found) and `update` (returns `null` if not found).
- **Implementation:** Standard Spring Data JPA `existsById` checks.
- **Pattern / Source Reference:**
  - *Project reference / existing implementation pattern:* `backend/src/main/java/za/ac/cput/tekkiestorecapstone/service/IOrderItemService.java`.
  - *Official documentation:* [Spring Data JPA CrudRepository](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html).

#### 5. Order.java (Domain Entity)
- **File Path:** `backend/src/main/java/za/ac/cput/tekkiestorecapstone/domain/Order.java`
- **What Changed:** 
  - Preserved `@Entity`, `@Table(name = "orders")` (crucial: `order` is a reserved SQL keyword in MySQL and TiDB), `@Id`, `@Enumerated(EnumType.STRING)` for `status`.
  - Preserved Builder pattern, no-arg constructor `protected Order()`, and getters.
  - Added a concise `// TODO:` comment marking placeholder for future relational associations (`OrderItem`, `Customer`, `DeliveryDetails`).
- **Pattern / Source Reference:**
  - *Project reference:* Existing entity structure and Builder pattern across all domain models.
  - *Framework documentation:* [Jakarta Persistence @Table specification](https://jakarta.ee/specifications/persistence/) (for reserved keyword avoidance).

#### 6. OrderItem.java (Domain Entity)
- **File Path:** `backend/src/main/java/za/ac/cput/tekkiestorecapstone/domain/OrderItem.java`
- **What Changed:** 
  - Preserved `@Entity`, `@Id`, fields (`orderItemId`, `quantity`, `unitPrice`, `subTotal`), Builder pattern, and no-arg constructor.
  - Added a concise `// TODO:` comment marking placeholder for future relational associations (`Order`, `Shoe`, `ShoeVariant`).
- **Pattern / Source Reference:**
  - *Project reference:* Existing entity structure across the repository.

#### 7. OrderStatus.java (Domain Enum)
- **File Path:** `backend/src/main/java/za/ac/cput/tekkiestorecapstone/domain/OrderStatus.java`
- **Status:** Unchanged. Verified that it remains a clean enum inside the domain package containing `PENDING`, `PAID`, `PACKED`, `SHIPPED`, `DELIVERED`, `CANCELLED`. Not converted to an `@Entity`.

#### 8. OrderRepository.java & OrderItemRepository.java
- **File Paths:** 
  - `backend/src/main/java/za/ac/cput/tekkiestorecapstone/repository/OrderRepository.java`
  - `backend/src/main/java/za/ac/cput/tekkiestorecapstone/repository/OrderItemRepository.java`
- **Status:** Unchanged. Maintained as standard `JpaRepository<Order, String>` and `JpaRepository<OrderItem, String>` without custom SQL or complex overrides.

#### 9. OrderController.java & OrderItemController.java
- **File Paths:**
  - `backend/src/main/java/za/ac/cput/tekkiestorecapstone/controller/OrderController.java`
  - `backend/src/main/java/za/ac/cput/tekkiestorecapstone/controller/OrderItemController.java`
- **Status:** Unchanged. Preserved existing clean endpoints:
  - `POST /order/create`, `GET /order/read/{id}`, `PUT /order/update`, `DELETE /order/delete/{id}`, `GET /order/getAll`
  - `POST /orderItem/create`, `GET /orderItem/read/{id}`, `PUT /orderItem/update`, `DELETE /orderItem/delete/{id}`, `GET /orderItem/getAll`

---

### 9.3 Test Suite Updates & Validation

All factory, service, and controller tests were updated to validate the cleanup:

| Test File | Tests Run | What is Validated |
|---|---|---|
| `OrderFactoryTest.java` | 4 tests | Verifies valid creation, null checks for payment reference, negative amount validation, and default `OrderStatus.PENDING`. |
| `OrderItemFactoryTest.java` | 5 tests | Verifies line subtotal equals `quantity * unitPrice`, calls 3-argument factory, validates zero/negative quantity, negative price, and empty ID. |
| `OrderServiceTest.java` | 7 tests | Verifies CRUD operations, tests that `update` returns `null` for non-existent IDs, and tests that `delete` returns `false` when entity does not exist. |
| `OrderItemServiceTest.java` | 7 tests | Verifies CRUD operations, tests that `update` returns `null` for non-existent IDs, and tests that `delete` returns `false` when entity does not exist. |
| `OrderControllerTest.java` | 5 tests | Verifies controller layer delegates cleanly to service for create, read, update, delete, and getAll. |
| `OrderItemControllerTest.java` | 5 tests | Verifies controller layer delegates cleanly to service with updated 3-argument factory fixture. |

**Total Order/OrderItem Tests:** 33 tests executed, 0 failures, 0 errors.

---

### 9.4 Frontend vs. Backend Model Differences (Documentation for Next Stage)

Currently, `frontend/src/context/OrderContext.tsx` handles orders on the client side via React state and `localStorage` (`tekkie_store_orders`), while the backend has initial JPA models for `Order` and `OrderItem`. The following differences are noted for the upcoming workflow integration:

#### 1. Status Mismatches

| Frontend Status (`OrderContext.tsx`) | Backend Status (`OrderStatus.java`) | Notes |
|---|---|---|
| `'Order Confirmed'` | `PENDING` or `PAID` | Frontend combines initial checkout confirmation into one label; backend distinguishes between unpaid order creation (`PENDING`) and confirmed payment (`PAID`). |
| `'Processing'` | `PACKED` | Frontend refers to fulfillment preparation as "Processing", whereas backend models it as "PACKED". |
| `'Dispatched'` | `SHIPPED` | Dispatched vs Shipped terminology. |
| `'Delivered'` | `DELIVERED` | Direct match. |
| *(None)* | `CANCELLED` | Backend supports cancellation status. |

#### 2. Order Entity Fields Comparison

| Field Concept | Frontend Model (`OrderContext.tsx`) | Backend Model (`Order.java`) |
|---|---|---|
| Identifier | `id` (e.g. `"TK-88291"`), `orderNumber` (e.g. `"#TK-88291"`) | `orderId` (String) |
| Date | `createdAt` (ISO string), `dateFormatted` (e.g. `"Oct 24, 2026"`) | `orderDate` (`java.util.Date`) |
| Delivery Timeline | `estimatedArrival` (e.g. `"Oct 28 - 30"`) | Managed by `DeliveryDetails` entity (not yet linked) |
| Line Items | `items: OrderItem[]`, `itemsCount: number` | Not yet linked (to be defined in next stage) |
| Pricing Breakdown | `subtotal`, `shippingFee`, `vat`, `total` | `totalAmount` (double) |
| Shipping Address | `shippingAddress: OrderShippingAddress` | Intended for future `DeliveryDetails` link |
| Shipping Method | `shippingMethod: string` (e.g. `"DSV EXPRESS AIR"`) | Managed in `DeliveryDetails` |
| Payment Info | `paymentMethod: 'card' \| 'eft'`, `paymentReference` | `paymentReference` (String) |
| Shipment Tracking | `trackingNumber` (e.g. `"DSV-ZA-99482710"`) | Managed in `DeliveryDetails` |

#### 3. OrderItem Fields Comparison

| Field Concept | Frontend Model (`OrderContext.tsx`) | Backend Model (`OrderItem.java`) |
|---|---|---|
| Identifier | `id` (string) | `orderItemId` (String) |
| Product Reference | `productId`, `name`, `brand`, `image` | Not yet linked (to connect to `Shoe` in next stage) |
| Variant Reference | `size` (string) | Not yet linked (to connect to `ShoeVariant`/`ShoeSize`) |
| Pricing | `price`, `quantity` | `unitPrice`, `quantity`, `subTotal` |

---


### 9.5 Future Frontend Integration Guidelines

When the complete order workflow is implemented in the next stage:
1. **Central Axios Client:** All HTTP communications must reuse the existing central Axios client at `frontend/src/services/api.ts` (`import api from './api';`). Do not instantiate a second `axios.create(...)` or bypass the JWT interceptor.
2. **Official Axios Documentation:** [https://axios-http.com/](https://axios-http.com/)
3. **No premature frontend rewrite:** `OrderContext.tsx` was not modified in this cleanup to avoid breaking the existing checkout UI demonstration before the backend order relationship architecture is formalized.

---

## 10. Customer, Order & OrderItem — Full Relational Integration

This section documents the complete end-to-end connection of `Customer → Order → OrderItem` with `OrderStatus` across the Spring Boot backend and React/TypeScript/Axios frontend. Upon a successful checkout, a real `Order` referencing the authenticated `Customer` is persisted to TiDB Cloud, along with all associated `OrderItem` rows, and is displayed back to the user on the `OrderConfirmation` page and the `RecentOrders` profile component.

> **Note:** `DeliveryDetails` is explicitly **not** connected in this stage. It will be integrated in a later, separate stage.

---

### 10.1 Overview & Scope

| Concern | Decision |
|---|---|
| Code simplicity | No DTO layers, mappers, Lombok, custom exceptions, or response wrappers introduced |
| Architecture | Controller → Service → Repository pattern consistent with the rest of the project |
| Axios | Reused existing `frontend/src/services/api.ts` — no second instance created |
| Password security | `Customer.password` annotated with `@JsonProperty(access = WRITE_ONLY)` — never serialized to JSON |
| Relationship direction | `Order @ManyToOne Customer` (unidirectional — Customer has no `orders` list) |
| Item cascade | `Order @OneToMany(cascade = ALL) List<OrderItem>`; `OrderItem @ManyToOne Order` (`@JsonIgnore`) |
| New order status | Always enforced as `OrderStatus.PENDING` regardless of what the frontend sends |
| Delivery | No `DeliveryDetails` fields added to `Order` |

---

### 10.2 Database Relationships

```
customer
  └─ customer_id (PK)

orders
  ├─ order_id (PK)
  ├─ customer_id (FK → customer.customer_id)
  ├─ status (VARCHAR — PENDING | CONFIRMED | ...)
  ├─ subtotal, shipping_fee, vat, total_amount
  ├─ payment_method, payment_reference
  └─ order_date

order_item
  ├─ order_item_id (PK)
  ├─ order_id (FK → orders.order_id)
  ├─ shoe_id (snapshot — no FK to shoe table)
  ├─ shoe_name, brand, size, image_url (snapshot columns)
  ├─ quantity, unit_price, sub_total
```

`OrderItem` stores snapshot columns (`shoeId`, `shoeName`, `brand`, `size`, `imageUrl`) rather than a live foreign key to `Shoe`. This means the order history remains accurate even if a shoe is later modified or removed from the catalogue.

---

### 10.3 Backend Files Changed

#### [MODIFIED] `Customer.java`
- Added `@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)` to `password` field.
- **Why:** Prevents the customer password from being serialized into any JSON API response, including Order responses that nest the Customer object.
- **Pattern reference:** Jackson `@JsonProperty(access = WRITE_ONLY)` — [Jackson Databind documentation](https://fasterxml.github.io/jackson-databind/).

#### [MODIFIED] `Order.java`
- Added `@ManyToOne(fetch = FetchType.LAZY) Customer customer` with `@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})`.
- Added `@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true) List<OrderItem> orderItems`.
- Added financial fields: `subtotal`, `shippingFee`, `vat`, `totalAmount`.
- Added `paymentMethod`, `paymentReference`.
- Updated Builder, getters, and setters accordingly.
- **Why `mappedBy`:** Prevents Hibernate from creating a join table; the FK lives in `order_item.order_id`.
- **Pattern reference:** [Jakarta Persistence @OneToMany / CascadeType.ALL](https://jakarta.ee/specifications/persistence/).

#### [MODIFIED] `OrderItem.java`
- Added `@ManyToOne(fetch = FetchType.LAZY) Order order` with `@JsonIgnore` (prevents JSON recursion).
- Added snapshot fields: `shoeId`, `shoeName`, `brand`, `size`, `imageUrl`.
- Updated Builder, getters, and setters accordingly.
- **Why `@JsonIgnore` on `order`:** Without it, Jackson would serialize `Order → OrderItem → Order → ...` infinitely.
- **Pattern reference:** Jackson `@JsonIgnore` — [Jackson Databind documentation](https://fasterxml.github.io/jackson-databind/).

#### [MODIFIED] `OrderFactory.java`
- Added full `createOrder(String orderId, Date orderDate, Customer customer, List<OrderItem> orderItems, double subtotal, double shippingFee, double vat, double totalAmount, String paymentMethod, String paymentReference)` overload.
- Preserved original 3-arg backward-compatible overload.
- **Pattern reference:** Existing `CustomerFactory.java` and `CartItemFactory.java` in the project.

#### [MODIFIED] `OrderItemFactory.java`
- Added snapshot-field overload: `createOrderItem(String id, String shoeId, String shoeName, String brand, String size, String imageUrl, int quantity, double unitPrice)`.
- Preserved original 3-arg overload.

#### [MODIFIED] `OrderRepository.java`
- Added derived query: `List<Order> findByCustomer_CustomerId(String customerId)`.
- **Pattern reference:** Spring Data JPA property traversal naming convention — [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/reference/).

#### [MODIFIED] `IOrderService.java` & `OrderService.java`
- Injected `CustomerRepository`.
- `create(Order order)`: validates the customer exists in the database, assigns each `OrderItem.order` back-reference (so the FK is populated), recalculates `subTotal` on each item, enforces `OrderStatus.PENDING` regardless of input.
- Added `getOrdersByCustomerId(String customerId)` delegating to `findByCustomer_CustomerId`.
- **Pattern reference:** `CustomerService.java` and `CartService.java` in the project.

#### [MODIFIED] `OrderController.java`
- Added `GET /order/customer/{customerId}` → returns `List<Order>` for the given customer.
- **Pattern reference:** `CartController.java` existing GET endpoints.

---

### 10.4 Backend JSON Response — Password Security

The following JSON field is **never** present in any API response involving a Customer:

```
❌ "password": "..."    ← never serialized
✅ "customer": { "customerId": "...", "email": "...", "name": { ... } }
```

This is verified by `OrderServiceTest.g_customerPasswordNeverExposedInOrderJson()`, which uses `ObjectMapper` to serialize a real `Order` object to JSON and asserts that:
1. `"password"` key does not appear anywhere in the output.
2. The actual password value does not appear anywhere in the output.

---

### 10.5 Backend Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/order/create` | Creates an `Order` with its `OrderItems` in one cascade save. Enforces `PENDING` status. |
| `GET` | `/order/read/{id}` | Returns a single `Order` by `orderId`. |
| `POST` | `/order/update` | Updates an existing `Order`. |
| `DELETE` | `/order/delete/{id}` | Deletes an `Order`. |
| `GET` | `/order/getAll` | Returns all orders. |
| `GET` | `/order/customer/{customerId}` | Returns all orders for a given authenticated customer. |

---

### 10.6 Frontend Files Changed

#### [NEW] `frontend/src/services/orderService.ts`
Dedicated Axios service wrapping all order REST endpoints. Reuses the existing central `api` instance.

**Exported types:**
```typescript
export interface BackendOrderItem {
  orderItemId: string;
  shoeId: string;
  shoeName: string;
  brand: string;
  size: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface BackendOrder {
  orderId: string;
  customer?: { customerId: string; name?: { firstName?: string; lastName?: string }; ... };
  orderItems: BackendOrderItem[];
  orderDate: string | number;
  subtotal: number;
  shippingFee: number;
  vat: number;
  totalAmount: number;
  paymentMethod: string;
  paymentReference: string;
  status: string;
}
```

**Exported functions:**

| Function | Axios Request | Description |
|---|---|---|
| `orderService.createOrder(payload)` | `POST /order/create` | Creates a new order and returns the saved `BackendOrder`. |
| `orderService.getOrderById(id)` | `GET /order/read/{id}` | Returns a single `BackendOrder` or `null`. |
| `orderService.getOrdersByCustomerId(id)` | `GET /order/customer/{id}` | Returns `BackendOrder[]` for a customer. |
| `formatOrderStatus(status)` | — | Maps backend enum values to display strings. |

#### [MODIFIED] `frontend/src/context/OrderContext.tsx`
- Imports `orderService`, `BackendOrder`, and `formatOrderStatus` from `orderService.ts`.
- `createOrder()` now requires authenticated user (`user.customerId`); throws if not logged in.
- Posts to `POST /order/create` with full customer reference and order items; maps the saved backend response to the local `Order` display type.
- Added `fetchOrderById(orderId)` — fetches from `GET /order/read/{id}` if not already in local state.
- Orders are also persisted in `localStorage` for resilience on page refresh.

#### [MODIFIED] `frontend/src/pages/CheckoutPage.tsx`
- `handlePlaceOrder` changed to `async` to support `await createOrder(...)` and `await clearCart()`.
- Requires authenticated user (`user.customerId`) before checkout.
- Navigates to `/order-confirmation/${newOrder.id}` on success.

#### [MODIFIED] `frontend/src/pages/OrderConfirmation.tsx`
- Added `useEffect` that calls `fetchOrderById(orderId)` from the URL param when the order is not already in local state.
- Resolves order from: (1) loaded backend order, (2) local context order, (3) fallback demo order.

#### [MODIFIED] `frontend/src/components/profile/RecentOrders.tsx`
- On mount, calls `orderService.getOrdersByCustomerId(user.customerId)` when the user is authenticated.
- Maps `BackendOrder[]` to the existing `Order` display type (defined in `frontend/src/types/profile.ts`).
- Falls back to `MOCK_ORDERS` for unauthenticated/demo users.
- `useEffect` re-runs on `activeOrder` change to refresh after new checkout.
- `getStatusBadgeClass` extended to handle `'Pending'` and `'Confirmed'` from backend enum mapping.
- Action buttons (`View Order Details`, `Track Package`, `Buy Again`) wired up to `useNavigate`.

---

### 10.7 Axios Request Payload — `POST /order/create`

```json
{
  "orderId": "TK-83921",
  "orderDate": "2026-09-08T12:00:00.000Z",
  "subtotal": 4998.0,
  "shippingFee": 0.0,
  "vat": 749.7,
  "totalAmount": 4998.0,
  "paymentMethod": "card",
  "paymentReference": "VISA-4921",
  "status": "PENDING",
  "customer": {
    "customerId": "C001"
  },
  "orderItems": [
    {
      "orderItemId": "OI-TK-83921-1",
      "shoeId": "S001",
      "shoeName": "Air Max 90",
      "brand": "Nike",
      "size": "UK 9",
      "imageUrl": "https://res.cloudinary.com/.../nike.jpg",
      "quantity": 2,
      "unitPrice": 2499.0,
      "subTotal": 4998.0
    }
  ]
}
```

The backend:
1. Looks up the real `Customer` via `CustomerRepository.findById(customerId)` — 404 if not found.
2. Sets `order.setStatus(OrderStatus.PENDING)` regardless of what the frontend sent.
3. Iterates `orderItems`, sets `item.setOrder(order)` on each, recalculates `subTotal`.
4. Calls `orderRepository.save(order)` — Hibernate cascade saves all `OrderItem` rows via `CascadeType.ALL`.

---

### 10.8 Test Coverage

All tests in the following suites pass (**38/38, BUILD SUCCESS**):

| Test Class | Tests | Covers |
|---|---|---|
| `OrderFactoryTest` | 4 | Factory creates orders with all fields; backward-compatible overloads |
| `OrderItemFactoryTest` | 5 | Factory creates items with snapshot fields; subTotal calculation |
| `OrderServiceTest` | 11 | CRUD + `getOrdersByCustomerId` + password-never-exposed JSON test |
| `OrderItemServiceTest` | 7 | CRUD including `existsById` update/delete guards |
| `OrderControllerTest` | 6 | REST layer CRUD + customer orders endpoint (Mockito) |
| `OrderItemControllerTest` | 5 | REST layer CRUD (Mockito) |

---

### 10.9 Presentation Cheatsheet

**Q: Why does the `Order` not store a foreign key to `DeliveryDetails`?**
> *"DeliveryDetails is a separate integration stage. Connecting it prematurely would introduce incomplete or null delivery records for every order. Orders work independently; delivery tracking is added as a follow-on capability."*

**Q: Why do `OrderItem` rows store snapshot columns (shoeName, brand, imageUrl) instead of a live FK to the Shoe table?**
> *"Order history must be immutable. If a shoe is renamed, repriced, or removed from the catalogue after purchase, the order record must still reflect exactly what the customer bought. Snapshot columns guarantee that."*

**Q: Why is `Customer.password` never returned in the Order JSON?**
> *"Jackson's `@JsonProperty(access = WRITE_ONLY)` tells the serializer to ignore the field during serialization while still allowing it to be deserialized on login. We also verify this programmatically with a unit test that serializes a real Order to JSON and asserts the password field is absent."*

**Q: Why is `OrderStatus.PENDING` enforced server-side rather than trusting the frontend?**
> *"Never trust the client to set business state. The frontend sends 'PENDING' as a convention, but the backend overwrites it regardless, ensuring no order can bypass the standard lifecycle by sending a forged status like 'DELIVERED'."*

**Q: Why does `@OneToMany` use `CascadeType.ALL` and `orphanRemoval = true`?**
> *"CascadeType.ALL means saving one Order automatically saves all its child OrderItems in a single transaction — no manual loop needed. orphanRemoval ensures that if an OrderItem is removed from the list, Hibernate deletes the row from the database automatically."*

---

### 10.10 Code References

| Source | Used For |
|---|---|
| `backend/.../domain/Order.java` | JPA entity with `@ManyToOne Customer`, `@OneToMany OrderItem`, financial and payment fields |
| `backend/.../domain/OrderItem.java` | JPA entity with `@ManyToOne Order` (`@JsonIgnore`), snapshot shoe fields |
| `backend/.../domain/Customer.java` | `password` field annotated `@JsonProperty(access = WRITE_ONLY)` |
| `backend/.../factory/OrderFactory.java` | Full `createOrder` overload with Customer and OrderItems |
| `backend/.../factory/OrderItemFactory.java` | Snapshot-field overload for creating order line items |
| `backend/.../repository/OrderRepository.java` | `findByCustomer_CustomerId(String)` derived query |
| `backend/.../service/OrderService.java` | Customer validation, cascade save, PENDING enforcement, customer order lookup |
| `backend/.../controller/OrderController.java` | `GET /order/customer/{customerId}` endpoint |
| `frontend/src/services/api.ts` | Central Axios instance — reused, not duplicated |
| `frontend/src/services/orderService.ts` | `createOrder`, `getOrderById`, `getOrdersByCustomerId`, `formatOrderStatus` |
| `frontend/src/context/OrderContext.tsx` | Checkout → backend save → local state mapping |
| `frontend/src/pages/CheckoutPage.tsx` | `async handlePlaceOrder`, navigates to `/order-confirmation/{id}` |
| `frontend/src/pages/OrderConfirmation.tsx` | Fetches saved order from backend via `fetchOrderById` |
| `frontend/src/components/profile/RecentOrders.tsx` | Lists real customer orders fetched from `GET /order/customer/{id}` |
| Jackson Databind | `@JsonProperty(access = WRITE_ONLY)`, `@JsonIgnore`, `@JsonIgnoreProperties` |
| Jakarta Persistence | `@OneToMany`, `@ManyToOne`, `CascadeType.ALL`, `orphanRemoval` |
| Spring Data JPA | `findByCustomer_CustomerId` derived query, `CrudRepository.existsById` |

