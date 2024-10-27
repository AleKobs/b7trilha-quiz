'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Loader2 } from 'lucide-react'

type Path = 'frontend' | 'backend' | 'fullstack' | 'mobile'

interface Scores {
  frontend: number
  backend: number
  mobile: number
  fullstack: number
}

interface Option {
  text: string
  scores: Partial<Scores>
}

interface Question {
  question: string
  options: Option[]
}

const questions: Question[] = [
  {
    question: "Qual aspecto da programação mais te interessa?",
    options: [
      { text: "Criar interfaces visuais e interativas", scores: { frontend: 2, fullstack: 1, mobile: 1 } },
      { text: "Trabalhar com lógica e processamento de dados", scores: { backend: 2, fullstack: 1 } },
      { text: "Desenvolver aplicativos para smartphones", scores: { mobile: 2, fullstack: 1 } }
    ]
  },
  {
    question: "Como você prefere ver o resultado do seu trabalho?",
    options: [
      { text: "Visualmente, em uma tela ou dispositivo", scores: { frontend: 2, mobile: 2, fullstack: 1 } },
      { text: "Através de dados processados ou armazenados", scores: { backend: 2, fullstack: 1 } }
    ]
  },
  {
    question: "Qual destas atividades soa mais interessante para você?",
    options: [
      { text: "Otimizar o desempenho de um servidor", scores: { backend: 2, fullstack: 1 } },
      { text: "Criar layouts responsivos para diferentes dispositivos", scores: { frontend: 2, fullstack: 1 } },
      { text: "Desenvolver funcionalidades para apps móveis", scores: { mobile: 2, fullstack: 1 } }
    ]
  },
  {
    question: "Você se considera mais:",
    options: [
      { text: "Criativo e voltado para design", scores: { frontend: 2, mobile: 1, fullstack: 1 } },
      { text: "Analítico e focado em solução de problemas", scores: { backend: 2, fullstack: 1 } }
    ]
  },
  {
    question: "Qual área você acha que tem mais oportunidades no mercado atual?",
    options: [
      { text: "Desenvolvimento Web", scores: { frontend: 1, backend: 1, fullstack: 2 } },
      { text: "Desenvolvimento Mobile", scores: { mobile: 2, fullstack: 1 } },
      { text: "Desenvolvimento de Software em geral", scores: { fullstack: 2, backend: 1 } }
    ]
  }
]

const pathCourses: { [key in Path]: string[] } = {
  frontend: [
    "HTML5 e CSS3",
    "Javascript",
    "ReactJS",
    "VueJS",
    "NextJS",
    "Sass",
    "TailwindCSS",
    "Webpack"
  ],
  backend: [
    "PHP 8.3",
    "Laravel 11",
    "NodeJS",
    "AdonisJS",
    "Bancos de Dados",
    "API RESTful",
    "GraphQL"
  ],
  fullstack: [
    "HTML5 e CSS3",
    "Javascript",
    "ReactJS",
    "NodeJS",
    "Bancos de Dados",
    "API RESTful",
    "Docker",
    "Git/GitHub"
  ],
  mobile: [
    "Javascript",
    "React Native",
    "Flutter",
    "Desenvolvimento de Apps iOS",
    "Desenvolvimento de Apps Android",
    "APIs RESTful",
    "Gerenciamento de Estado"
  ]
}

export function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [scores, setScores] = useState<Scores>({ frontend: 0, backend: 0, mobile: 0, fullstack: 0 })
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false)
  const [recommendedPath, setRecommendedPath] = useState<Path | ''>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    setProgress((currentQuestion / questions.length) * 100)
  }, [currentQuestion])

  const handleAnswer = () => {
    if (selectedOption) {
      const option = questions[currentQuestion].options.find(opt => opt.text === selectedOption)
      if (option) {
        setScores(prevScores => {
          const newScores: Scores = { ...prevScores }
          Object.entries(option.scores).forEach(([key, value]) => {
            const typedKey = key as keyof Scores
            if (typedKey in newScores && typeof value === 'number') {
              newScores[typedKey] += value
            }
          })
          return newScores
        })
      }

      setIsLoading(true)

      setTimeout(() => {
        setIsLoading(false)
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setSelectedOption('')
        } else {
          finishQuiz()
        }
      }, 1000)
    }
  }

  const finishQuiz = () => {
    const maxScore = Math.max(...Object.values(scores))
    const recommendedPaths = (Object.keys(scores) as Path[]).filter(key => scores[key] === maxScore)

    if (recommendedPaths.length === 1) {
      setRecommendedPath(recommendedPaths[0])
    } else {
      setRecommendedPath(recommendedPaths.includes('fullstack') ? 'fullstack' : recommendedPaths[0])
    }

    setQuizCompleted(true)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl relative">
        <div className="absolute inset-0 bg-blue-500 opacity-10 blur-3xl"></div>
        <div className="relative bg-gray-800 rounded-lg p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">
            {quizCompleted ? "Sua Jornada de Aprendizado" : `Pergunta ${currentQuestion + 1} de ${questions.length}`}
          </h2>
          <AnimatePresence mode="wait">
            {!quizCompleted && !isLoading && (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Progress value={progress} className="w-full mb-6" />
                <p className="text-xl mb-6">{questions[currentQuestion].question}</p>
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex items-center p-4 rounded-lg border-2 border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
                      >
                        <RadioGroupItem value={option.text} id={`option-${index}`} className="mr-3" />
                        {option.text}
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
                <Button onClick={handleAnswer} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6">
                  {currentQuestion < questions.length - 1 ? "Próxima Pergunta" : "Finalizar Quiz"}
                </Button>
              </motion.div>
            )}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                <p className="text-xl font-semibold text-blue-400">Processando sua resposta...</p>
              </motion.div>
            )}
            {quizCompleted && recommendedPath && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-bold text-center text-blue-400 mb-8">
                  Trilha Recomendada: {recommendedPath.charAt(0).toUpperCase() + recommendedPath.slice(1)}
                </h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-1 bg-blue-500 opacity-30"></div>
                  {pathCourses[recommendedPath].map((course: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center mb-6 relative"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white z-10">
                        {index + 1}
                      </div>
                      <div className="ml-4 p-4 rounded-lg flex-grow bg-gray-700 border-l-4 border-blue-500">
                        <h4 className="font-semibold text-lg text-blue-300">{course}</h4>
                        <p className="text-sm text-gray-400">
                          Este curso é essencial para sua jornada em {recommendedPath}.
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-xl font-semibold text-blue-400"
                >
                  Estou empolgado para ver seu progresso nesta jornada de aprendizado! <br />Cada passo é crucial para seu sucesso.
                </motion.p>
              </motion.div>
            )}


          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
