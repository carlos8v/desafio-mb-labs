export type Either<L, A> = Left<L, A> | Right<L, A>

interface Left<L, A> {
  value: L
  isLeft: () => this is Left<L, A>
  isRight: () => this is Right<L, A>
}

interface Right<L, A> {
  value: A
  isLeft: () => this is Left<L, A>
  isRight: () => this is Right<L, A>
}

export const left = <L, A>(value: L): Left<L, A> => ({
  value,
  isLeft: () => true,
  isRight: () => false
})

export const right = <L, A>(value: A): Right<L, A> => ({
  value,
  isLeft: () => false,
  isRight: () => true
})
