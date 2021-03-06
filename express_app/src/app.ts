import express, { Request, Response } from "express"
import path from "path"
import logger from "morgan"
import cookieParser from "cookie-parser"
import indexRouter from "./routes"
import usersRouter from "./routes/users"
import { NextFunction } from "express-serve-static-core"
import createHttpError from "http-errors"

interface ResponseError extends Error {
  status?: number
}

const app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createHttpError(404))
})

// error handler
app.use(function (err: ResponseError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status ?? 500)
  res.render("error")
})

export default app
