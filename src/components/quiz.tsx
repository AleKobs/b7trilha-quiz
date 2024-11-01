'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Loader2 } from 'lucide-react'


type LearningPath = 'frontend' | 'backend' | 'fullstack' | 'mobile'


// Interfaces
interface PathScores {
  frontend: number
  backend: number
  mobile: number
  fullstack: number
}

interface QuizOption {
  text: string
  scores: Partial<PathScores>
}


interface QuizQuestion {
  question: string
  options: QuizOption[]
}

// perguntas e "pesos"
const quizQuestions: QuizQuestion[] = [
  {
    question: "Quando você está resolvendo um problema, o que mais te motiva?",
    options: [
      { text: "Encontrar uma solução prática e rápida", scores: { frontend: 2, mobile: 1, fullstack: 1 } },
      { text: "Entender a fundo como o problema surgiu e resolvê-lo de forma eficiente", scores: { backend: 2, fullstack: 1, mobile: 1 } }
    ]
  },
  {
    question: "Qual dessas atividades parece mais interessante para você?",
    options: [
      { text: "Criar um site onde as pessoas possam se inscrever para receber novidades", scores: { frontend: 2, fullstack: 1, mobile: 1 } },
      { text: "Fazer um sistema que envia automaticamente as novidades para as pessoas inscritas", scores: { backend: 2, fullstack: 1, mobile: 1 } },
      { text: "Criar um aplicativo para celular que avisa as pessoas das novidades em tempo real", scores: { mobile: 2, fullstack: 1, frontend: 1 } }
    ]
  },
  {
    question: "Quando você está organizando suas coisas, como você prefere trabalhar?",
    options: [
      { text: "Gosto de deixar tudo bonito e bem organizado, para que seja fácil de encontrar", scores: { frontend: 2, mobile: 1, fullstack: 1 } },
      { text: "Prefiro criar sistemas para facilitar a organização, mesmo que não seja visualmente atraente", scores: { backend: 2, fullstack: 1, mobile: 1 } },
      { text: "Gosto de fazer um pouco dos dois: organizar e criar sistemas práticos de organização.", scores: { fullstack: 2, frontend: 1, backend: 1, mobile: 1 } }
    ]
  },
  {
    question: "Qual dessas atividades parece mais parecida com o que você gosta de fazer?",
    options: [
      { text: "Decorar e organizar ambientes, deixar as coisas com uma aparência atraente", scores: { frontend: 2, mobile: 1, fullstack: 1 } },
      { text: "Resolver quebra-cabeças e fazer cálculos, descobrir como as coisas funcionam", scores: { backend: 2, fullstack: 1, mobile: 1 } },
      { text: "Ser o 'conector', alguém que gosta de fazer várias partes trabalharem juntas", scores: { fullstack: 2, frontend: 1, backend: 1, mobile: 1 } }
    ]
  },
  {
    question: "Quando você pensa em criar algo digital, o que te parece mais interessante?",
    options: [
      { text: "Desenvolver sites e páginas que as pessoas acessam pelo navegador de internet", scores: { frontend: 2, fullstack: 1, mobile: 1 } },
      { text: "Criar aplicativos que as pessoas possam usar diretamente no celular ou tablet", scores: { mobile: 2, fullstack: 1, frontend: 1 } },
      { text: "Fazer com que tanto o site quanto o aplicativo funcionem juntos, em todas as plataformas", scores: { fullstack: 2, frontend: 1, backend: 1, mobile: 1 } }
    ]
  }
]

// lista de cursos na ordem e por caminho TODO:AJUSTAR
const recommendedCourses: { [key in LearningPath]: string[] } = {
  frontend: [
    "HTML5 e CSS3",
    "Javascript",
    "10 Projetos Javascript (Prática)",
    "ReactJS",
    "TailwindCSS",
  ],
  backend: [
    "PHP 8.3",
    "Bancos de Dados",
    "Laravel 11",
    "NodeJS",
    "AdonisJS",
  ],
  fullstack: [
    "HTML5 e CSS3",
    "Javascript",
    "10 Projetos Javascript (Prática)",
    "ReactJS",
    "PHP 8.3",
    "Bancos de Dados",
    "Laravel 11",
    "NodeJS",
    "AdonisJS",
    "Docker",
    "Git/GitHub"
  ],
  mobile: [
    "HTML5 e CSS3",
    "Javascript",
    "React Native",
  ]
}

export function Quiz() {

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  // Esquema de pontuação por pergunta
  const [pathScores, setPathScores] = useState<PathScores>({ frontend: 0, backend: 0, mobile: 0, fullstack: 0 })
  const [recommendedPath, setRecommendedPath] = useState<LearningPath | ''>('')

  const [isLoading, setIsLoading] = useState<boolean>(false)




  useEffect(() => {
    setProgress((currentQuestionIndex / quizQuestions.length) * 100)
  }, [currentQuestionIndex])

  // Função chamada quando o usuário responde a uma pergunta
  const handleAnswer = () => {
    if (selectedOption) {
      // Busca a opção selecionada e atualiza as pontuações dos caminhos
      const option = quizQuestions[currentQuestionIndex].options.find(opt => opt.text === selectedOption)
      if (option) {
        setPathScores(prevScores => {
          const updatedScores: PathScores = { ...prevScores }
          Object.entries(option.scores).forEach(([key, value]) => {
            const typedKey = key as keyof PathScores
            if (typedKey in updatedScores && typeof value === 'number') {
              updatedScores[typedKey] += value
            }
          })
          return updatedScores
        })
      }


      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        if (currentQuestionIndex < quizQuestions.length - 1) {
          // proxima pergunta
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          setSelectedOption('')
        } else {
          finishQuiz()
        }
      }, 1000)
    }
  }


  const finishQuiz = () => {
    // Calcula o caminho com a maior pontuação e faz a recomendação final
    const maxScore = Math.max(...Object.values(pathScores))
    const recommendedPaths = (Object.keys(pathScores) as LearningPath[]).filter(key => pathScores[key] === maxScore)

    // Se empatar, recomenda 'fullstack', senão recomenda o caminho com maior pontuação
    if (recommendedPaths.length === 1) {
      setRecommendedPath(recommendedPaths[0])
    } else {
      setRecommendedPath(recommendedPaths.includes('fullstack') ? 'fullstack' : recommendedPaths[0])
    }

    setQuizCompleted(true)
    confetti({
      particleCount: 120,
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

            {quizCompleted ? "Sua Jornada de Aprendizado" : `Pergunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`}

          </h2>
          <AnimatePresence mode="wait">
            {!quizCompleted && !isLoading && (
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Progress value={progress} className="w-full mb-6" />
                <p className="text-xl mb-6">{quizQuestions[currentQuestionIndex].question}</p>
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-4">
                  {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`overflow-hidden rounded-lg ${selectedOption === option.text ? 'bg-blue-500 border-blue-500' : 'border-gray-700'}`}
                    >
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex items-center p-4 rounded-lg border-2 border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
                      >
                        <RadioGroupItem value={option.text} id={`option-${index}`} className="mr-3 bg-white" />
                        {option.text}
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
                <Button onClick={handleAnswer} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6">
                  {currentQuestionIndex < quizQuestions.length - 1 ? "Próxima Pergunta" : "Finalizar Quiz"}
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
                  Trilha Recomendada: <br />{recommendedPath.charAt(0).toUpperCase() + recommendedPath.slice(1)}
                </h3>

                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-1 bg-blue-500 opacity-30"></div>
                  {recommendedCourses[recommendedPath].map((course: string, index: number) => (
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
      </div >
    </div >
  )
}
