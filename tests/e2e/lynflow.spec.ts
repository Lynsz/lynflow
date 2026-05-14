import { expect, test, type Page } from "@playwright/test"

const testUser = {
  name: "Lynflow E2E",
  email: "lynflow-e2e@example.com",
  password: "123456",
}

async function resetLocalState(page: Page) {
  await page.goto("/")
  await page.evaluate(() => {
    localStorage.clear()
  })
}

async function disableOnboarding(page: Page) {
  await page.evaluate(() => {
    localStorage.setItem("lynflow-onboarding-completed", "true")
  })
}

async function registerLocalUser(page: Page) {
  await resetLocalState(page)
  await disableOnboarding(page)
  await page.goto("/register")

  await page.getByLabel("Digite seu nome").fill(testUser.name)
  await page.getByLabel("Digite seu e-mail").fill(testUser.email)
  await page.getByLabel("Crie uma senha").fill(testUser.password)
  await page.getByRole("button", { name: "Criar conta" }).click()

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(
    page.getByRole("heading", { level: 1, name: "Dashboard" })
  ).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await resetLocalState(page)
})

test("landing page carrega e permite ir para login", async ({ page }) => {
  await page.goto("/")

  await expect(
    page.getByRole("heading", {
      name: /Organize sua rotina com uma interface moderna e inteligente\./,
    })
  ).toBeVisible()

  await page.getByRole("link", { name: "Acessar app" }).click()

  await expect(page).toHaveURL(/\/login$/)
  await expect(
    page.getByRole("heading", { name: "Bem-vinda ao Lynflow" })
  ).toBeVisible()
})

test("dashboard protegido redireciona para login sem sessao", async ({ page }) => {
  await page.goto("/dashboard")

  await expect(page).toHaveURL(/\/login$/)
  await expect(
    page.getByRole("heading", { name: "Bem-vinda ao Lynflow" })
  ).toBeVisible()
})

test("usuario consegue fazer cadastro local, sair e entrar novamente", async ({
  page,
}) => {
  await disableOnboarding(page)
  await page.goto("/register")

  await page.getByLabel("Digite seu nome").fill(testUser.name)
  await page.getByLabel("Digite seu e-mail").fill(testUser.email)
  await page.getByLabel("Crie uma senha").fill(testUser.password)
  await page.getByRole("button", { name: "Criar conta" }).click()

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(
    page.getByRole("heading", { level: 1, name: "Dashboard" })
  ).toBeVisible()

  await page.evaluate(() => {
    localStorage.removeItem("lynflow-session")
  })
  await page.goto("/login")

  await page.getByLabel("Digite seu e-mail").fill(testUser.email)
  await page.getByLabel("Digite sua senha").fill(testUser.password)
  await page.getByRole("button", { name: "Entrar" }).click()

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(
    page.getByRole("heading", { level: 1, name: "Dashboard" })
  ).toBeVisible()
})

test("usuario autenticado acessa Dashboard, Tasks, Calendar e Goals", async ({
  page,
}) => {
  await registerLocalUser(page)

  await page.getByRole("link", { name: "Tasks" }).click()
  await expect(page).toHaveURL(/\/tasks$/)
  await expect(
    page.getByRole("heading", { level: 1, name: "Tasks" })
  ).toBeVisible()

  await page.getByRole("link", { name: "Calendar" }).click()
  await expect(page).toHaveURL(/\/calendar$/)
  await expect(
    page.getByRole("heading", { level: 1, name: "Calendar" })
  ).toBeVisible()

  await page.getByRole("link", { name: "Goals" }).click()
  await expect(page).toHaveURL(/\/goals$/)
  await expect(
    page.getByRole("heading", { level: 1, name: "Goals" })
  ).toBeVisible()

  await page.getByRole("link", { name: "Dashboard" }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(
    page.getByRole("heading", { level: 1, name: "Dashboard" })
  ).toBeVisible()
})

test("usuario consegue criar e concluir uma tarefa", async ({ page }) => {
  const taskTitle = `Tarefa E2E ${Date.now()}`

  await registerLocalUser(page)
  await page.getByRole("link", { name: "Tasks" }).click()

  await page.getByLabel("Criar nova tarefa").fill(taskTitle)
  await page.getByLabel("Categoria da tarefa").fill("E2E")
  await page.getByLabel("Prioridade da tarefa").selectOption("high")
  await page.getByRole("button", { name: "Add" }).click()

  await expect(
    page.getByRole("button", { exact: true, name: taskTitle })
  ).toBeVisible()

  await page.getByRole("button", { name: "Kanban" }).click()
  await expect(
    page.getByRole("heading", { level: 3, name: "Pendentes" })
  ).toBeVisible()

  const taskCheckbox = page.getByRole("checkbox", {
    name: `Concluir tarefa "${taskTitle}"`,
  })

  await taskCheckbox.click()

  await expect(
    page.getByRole("checkbox", { name: `Reabrir tarefa "${taskTitle}"` })
  ).toBeChecked()
})
