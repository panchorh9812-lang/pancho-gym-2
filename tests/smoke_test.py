"""End-to-end smoke checks for PANCHO GYM 2.0.

Requirements: pip install playwright pillow; playwright install chromium
Run: python tests/smoke_test.py
Set CHROMIUM_PATH=/path/to/chromium to use a system browser.
"""
from __future__ import annotations

import json
import os
import tempfile
import threading
from datetime import date, timedelta
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    errors: list[str] = []
    console_errors: list[str] = []
    with tempfile.TemporaryDirectory(prefix="pancho-gym-test-") as tmp:
        photo_path = Path(tmp) / "fixture.png"
        Image.new("RGB", (120, 180), (70, 145, 95)).save(photo_path)
        server = ThreadingHTTPServer(
            ("127.0.0.1", 0),
            partial(SimpleHTTPRequestHandler, directory=str(ROOT)),
        )
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        url = f"http://127.0.0.1:{server.server_port}/"
        try:
            with sync_playwright() as playwright:
                launch_args = {"headless": True, "args": ["--no-sandbox", "--no-proxy-server"]}
                chromium_path = os.environ.get("CHROMIUM_PATH")
                if chromium_path:
                    launch_args["executable_path"] = chromium_path
                browser = playwright.chromium.launch(**launch_args)
                context = browser.new_context(
                    accept_downloads=True,
                    viewport={"width": 1280, "height": 900},
                )
                page = context.new_page()
                page.set_default_timeout(7000)
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)

                # Startup, default profiles, PWA manifest and initial profile data.
                page.goto(url, wait_until="networkidle")
                page.locator(".hero-panel").wait_for()
                assert page.title() == "PANCHO GYM 2.0"
                assert page.locator("#profile-switch option").count() == 2
                assert page.locator("#profile-switch").input_value() == "profile-me"
                manifest = page.evaluate("fetch('manifest.webmanifest').then(r => r.json())")
                assert manifest["name"] == "PANCHO GYM 2.0"
                assert page.evaluate("'serviceWorker' in navigator")
                page.wait_for_function("navigator.serviceWorker && navigator.serviceWorker.controller")
                print("PASS startup + PWA manifest + service worker")

                # Profile form changes persist and do not leak into the sister profile.
                page.locator('.nav-item[data-view="perfil"]').click()
                page.locator('#profile-form input[name="weight"]').fill("82.4")
                page.locator('#profile-form input[name="height"]').fill("176")
                page.locator('#profile-form input[name="age"]').fill("30")
                page.get_by_role("button", name="Guardar cambios").click()
                page.wait_for_function("document.querySelector('#profile-form input[name=weight]')?.value === '82.4'")
                page.locator("#profile-switch").select_option(label="Perfil de mi hermana")
                page.wait_for_function("document.querySelector('#profile-switch')?.value === 'profile-sister'")
                page.locator('.nav-item[data-view="rutinas"]').click()
                page.locator(".empty-state").wait_for()
                assert page.locator(".routine-card").count() == 0
                page.locator('.nav-item[data-view="perfil"]').click()
                assert page.locator('#profile-form input[name="weight"]').input_value() == ""
                page.locator('.nav-item[data-view="rutinas"]').click()
                page.get_by_role("button", name="Generar rutina recomendada").click()
                page.wait_for_function("document.querySelectorAll('.routine-card').length === 1")
                assert "recomendado" in page.locator(".routine-card h3").inner_text().lower()
                page.locator("#profile-switch").select_option(label="Mi perfil")
                page.locator('.nav-item[data-view="perfil"]').click()
                page.wait_for_function("document.querySelector('#profile-form input[name=weight]')?.value === '82.4'")
                page.locator('.nav-item[data-view="rutinas"]').click()
                page.wait_for_function("document.querySelectorAll('.routine-card').length === 1")
                print("PASS profiles isolated + recommended routine per profile + metrics saved")

                # Add another independent profile from the header.
                page.locator("#add-profile-btn").click()
                page.locator('#create-profile-form input[name="name"]').fill("Perfil adicional")
                page.get_by_role("button", name="Crear perfil").click()
                page.wait_for_function("document.querySelectorAll('#profile-switch option').length === 3")
                assert page.locator("#profile-switch").input_value().startswith("profile-")
                page.locator('#profile-form input[name="weight"]').fill("64.2")
                page.get_by_role("button", name="Guardar cambios").click()
                page.locator("#profile-switch").select_option(label="Mi perfil")
                page.locator('.nav-item[data-view="perfil"]').click()
                page.wait_for_function("document.querySelector('#profile-form input[name=weight]')?.value === '82.4'")
                page.locator("#profile-switch").select_option(label="Perfil adicional")
                page.locator('.nav-item[data-view="perfil"]').click()
                page.wait_for_function("document.querySelector('#profile-form input[name=weight]')?.value === '64.2'")
                page.locator("#profile-switch").select_option(label="Mi perfil")
                page.locator('.nav-item[data-view="rutinas"]').click()
                page.locator(".routine-card").wait_for()
                print("PASS create additional profile + independent personal data")

                # Add and edit a multi-exercise routine.
                page.locator('.nav-item[data-view="rutinas"]').click()
                page.locator(".routine-card").wait_for()
                assert page.locator(".routine-card").count() == 1
                page.get_by_role("button", name="Crear rutina").first.click()
                page.locator('#routine-editor-form input[name="name"]').fill("Rutina de prueba")
                page.locator('#routine-editor-form button[data-action="add-exercise"]').click()
                rows = page.locator(".routine-exercise-row")
                page.wait_for_function("document.querySelectorAll('.routine-exercise-row').length === 2")
                assert rows.count() == 2
                rows.nth(0).locator('[data-field="sets"]').fill("2")
                rows.nth(0).locator('[data-field="reps"]').fill("8")
                rows.nth(0).locator('[data-field="weight"]').fill("22.5")
                page.get_by_role("button", name="＋ Añadir día").click()
                page.wait_for_function("document.querySelectorAll('.editor-day-tabs .day-tab').length === 3")
                page.locator("#routine-editor-form button[data-action='add-exercise']").click()
                page.wait_for_function("document.querySelectorAll('.routine-exercise-row').length === 1")
                page.get_by_role("button", name="Día 1 · Cuerpo completo").click()
                page.get_by_role("button", name="Guardar rutina").click()
                page.get_by_text("Rutina de prueba", exact=True).wait_for()
                assert page.locator(".routine-card").count() == 2
                routine_card = page.locator(".routine-card").filter(has_text="Rutina de prueba")
                routine_card.get_by_role("button", name="Editar").click()
                page.locator(".routine-exercise-row").first.locator('[data-field="sets"]').fill("4")
                page.get_by_role("button", name="Guardar rutina").click()
                page.get_by_text("Rutina de prueba", exact=True).wait_for()
                print("PASS create/edit routine + days + exercises")

                # Start a workout, log sets/loads, use rest timer, pause/resume, finish.
                routine_card = page.locator(".routine-card").filter(has_text="Rutina de prueba")
                routine_card.get_by_role("button", name="Entrenar").click()
                page.wait_for_function("document.querySelector('#training-routine')?.value !== ''")
                assert page.locator("#training-routine").input_value() != "routine-me-starter"
                page.get_by_role("button", name="Iniciar entrenamiento").click()
                page.locator(".live-chip").wait_for()
                assert page.locator(".workout-exercise").count() == 2
                weight_input = page.locator('input[data-session-field="weight"]').first
                weight_input.fill("25")
                weight_input.dispatch_event("change")
                page.locator('.workout-exercise-head [data-action="exercise-detail"]').first.click()
                page.locator(".exercise-detail-card").wait_for()
                page.get_by_role("button", name="×").click()
                page.locator('select[data-replace-exercise="0"]').select_option("child-pose")
                page.wait_for_function("document.querySelector('.workout-exercise h3')?.textContent === 'Postura del niño'")
                page.locator('.set-check').first.click()
                page.wait_for_function("document.querySelector('.progress-ring span')?.textContent !== '0%'")
                page.get_by_role("button", name="＋ 60 s").click()
                assert page.locator("#rest-timer").inner_text() == "01:00"
                page.wait_for_timeout(1100)
                assert page.locator("#rest-timer").inner_text() == "00:59"
                page.get_by_role("button", name="Ⅱ Pausar").click()
                page.locator(".paused-banner").wait_for()
                assert page.locator('input[data-session-field="done"]').first.is_disabled()
                page.get_by_role("button", name="▶ Reanudar").click()
                page.once("dialog", lambda dialog: dialog.accept())
                page.get_by_role("button", name="Finalizar sesión").click()
                page.wait_for_function("!document.querySelector('.live-chip')")
                page.get_by_role("button", name="Iniciar entrenamiento").click()
                page.locator(".live-chip").wait_for()
                page.once("dialog", lambda dialog: dialog.accept())
                page.get_by_role("button", name="Cancelar").click()
                page.wait_for_function("!document.querySelector('.live-chip')")
                print("PASS workout series + load + timer + pause/resume + finish/cancel")

                # Measurements, body stats and completed workout history.
                page.locator('.nav-item[data-view="progreso"]').click()
                page.locator(".history-row").wait_for()
                assert page.locator(".history-row").count() >= 1
                page.locator('#measurement-form input[name="waist"]').fill("84")
                page.locator('#measurement-form input[name="weight"]').fill("81.8")
                page.get_by_role("button", name="Guardar medidas").click()
                page.wait_for_function("document.querySelectorAll('.measurement-row').length >= 2")
                assert any("81.8" in text or "81,8" in text for text in page.locator(".metric-card").all_inner_texts())
                print("PASS measurements + statistics + history")

                # Photo upload, database persistence after reload, and backup restore.
                page.locator('.nav-item[data-view="fotos"]').click()
                page.locator('#photo-form input[type="file"]').set_input_files(str(photo_path))
                page.locator('#photo-form textarea[name="comment"]').fill("Foto de control")
                page.get_by_role("button", name="Guardar fotografía").click()
                page.wait_for_function("document.querySelectorAll('.photo-card').length === 1")
                assert page.locator(".photo-card").count() == 1
                page.locator('#photo-form input[type="file"]').set_input_files(str(photo_path))
                page.locator('#photo-form input[name="date"]').fill((date.today() - timedelta(days=30)).isoformat())
                page.locator('#photo-form select[name="category"]').select_option("Espalda")
                page.get_by_role("button", name="Guardar fotografía").click()
                page.wait_for_function("document.querySelectorAll('.photo-card').length === 2")
                photos = page.locator(".photo-card")
                photo_ids = [photos.nth(i).locator("button[data-action='delete-photo']").get_attribute("data-id") for i in range(2)]
                page.locator('[data-compare-index="0"]').select_option(photo_ids[0])
                page.locator('[data-compare-index="1"]').select_option(photo_ids[1])
                page.locator(".photo-comparison").wait_for()
                assert page.locator(".photo-comparison figure").count() == 2
                page.reload(wait_until="networkidle")
                page.wait_for_function("navigator.serviceWorker && navigator.serviceWorker.controller")
                page.locator('.nav-item[data-view="fotos"]').click()
                page.wait_for_function("document.querySelectorAll('.photo-card').length === 2")
                print("PASS photo upload + IndexedDB persistence after reload")

                page.locator('.nav-item[data-view="ajustes"]').click()
                with page.expect_download() as download_info:
                    page.get_by_role("button", name="Descargar respaldo completo").click()
                backup_path = Path(tmp) / "backup.json"
                download_info.value.save_as(backup_path)
                backup = json.loads(backup_path.read_text(encoding="utf-8"))
                assert len(backup["profiles"]) == 3
                assert len(backup["routines"]) == 3
                assert len(backup["sessions"]) >= 1
                assert len(backup["photos"]) == 2 and all(photo["dataUrl"].startswith("data:image/") for photo in backup["photos"])

                page.locator('.nav-item[data-view="fotos"]').click()
                page.once("dialog", lambda dialog: dialog.accept())
                page.locator('.photo-card button[data-action="delete-photo"]').first.click()
                page.wait_for_function("document.querySelectorAll('.photo-card').length === 1")
                page.once("dialog", lambda dialog: dialog.accept())
                page.locator('.photo-card button[data-action="delete-photo"]').first.click()
                page.locator(".photo-empty").wait_for()
                page.locator('.nav-item[data-view="ajustes"]').click()
                page.once("dialog", lambda dialog: dialog.accept())
                page.locator("#backup-file").set_input_files(str(backup_path))
                page.wait_for_function("document.querySelector('#toast-region')?.textContent.includes('Respaldo restaurado correctamente')")
                assert page.locator("#profile-switch").input_value() == "profile-me"
                page.locator('.nav-item[data-view="fotos"]').click()
                page.wait_for_function("document.querySelectorAll('.photo-card').length === 2")
                assert page.locator(".photo-card").count() == 2
                print("PASS backup export + validation/import + photo recovery")

                # Offline navigation after the first cache fill and narrow mobile layout.
                context.set_offline(True)
                page.reload(wait_until="domcontentloaded")
                page.locator(".hero-panel").wait_for()
                assert page.locator("#network-status").inner_text() == "Sin conexión"
                context.set_offline(False)
                page.set_viewport_size({"width": 390, "height": 844})
                page.locator('.nav-item[data-view="inicio"]').click()
                page.wait_for_function("document.documentElement.scrollWidth <= window.innerWidth")
                assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
                print("PASS offline reload + mobile width (390 px)")

                assert not errors, f"JavaScript errors: {errors}"
                assert not console_errors, f"Console errors: {console_errors}"
                print("PASS no uncaught JavaScript / console errors")
                browser.close()
        finally:
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    main()
