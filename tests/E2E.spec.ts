import { Article, ArticleSchema, User } from "../fixtures/api/schemas";
import { test, expect } from "../fixtures/test-options";
import testData from "../test-data/test-data.json";

test.describe("E2E", () => {
  let token: string;
  let slug: string;
  const baseUrl = "https://conduit-api.bondaracademy.com/api/";

  test.beforeAll(async ({ apiRequest }) => {
    const { status, body } = await apiRequest<User>({
      method: "POST",
      url: "users/login",
      baseUrl: baseUrl,
      body: { user: { email: "softuni@test.bg", password: "softuni123" } },
    });
    token = body.user.token;
  });

  test("E2E Article CRUD", { tag: "@E2E" }, async ({ apiRequest }) => {
    await test.step("Create Article", async () => {
      const { status, body } = await apiRequest<Article>({
        method: "POST",
        url: "articles",
        baseUrl: baseUrl,
        body: testData.create,
        headers: token,
      });

      expect(status).toBe(201);
      expect(ArticleSchema.parse(body)).toBeTruthy();
      expect(body.article.title).toBe(testData.create.article.title);
      slug = body.article.slug;
    });

    await test.step("Update Article", async () => {
      const { status, body } = await apiRequest<Article>({
        method: "PUT",
        url: `articles/${slug}`,
        baseUrl: baseUrl,
        body: testData.update,
        headers: token,
      });

      expect(status).toBe(200);
      expect(ArticleSchema.parse(body)).toBeTruthy();
      expect(body.article.title).toBe(testData.update.article.title);
      slug = body.article.slug;
    });

    await test.step("Delete Article", async () => {
      const { status, body } = await apiRequest<null>({
        method: "DELETE",
        url: `articles/${slug}`,
        baseUrl: baseUrl,
        headers: token,
      });
      expect(status).toBe(204);
    });

    await test.step("Verify Deleted Article", async () => {
      const { status, body } = await apiRequest<null>({
        method: "GET",
        url: `articles/${slug}`,
        baseUrl: baseUrl,
        headers: token,
      });
      expect(status).toBe(404);
    });
  });

  test.afterAll(async ({ apiRequest }) => {
    await apiRequest<null>({
      method: "DELETE",
      url: `articles/${slug}`,
      baseUrl: baseUrl,
      headers: token,
    });
  });
});
