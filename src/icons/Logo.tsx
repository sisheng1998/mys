import React from "react"

import { cn } from "@/lib/utils"

const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("shrink-0", className)}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.058 11.9994C16.058 9.97044 14.413 8.32544 12.384 8.32544C10.354 8.32544 8.70898 9.97044 8.70898 11.9994C8.70898 14.0284 10.354 15.6734 12.384 15.6734C14.413 15.6734 16.058 14.0284 16.058 11.9994Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.958 15.445C10.692 16.08 10.415 17.031 10.415 17.954C10.415 19.602 12.383 21.25 12.383 21.25C12.383 21.25 14.351 19.602 14.351 17.954C14.351 17.022 14.074 16.075 13.808 15.441"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.93781 10.575C8.30281 10.309 7.35181 10.033 6.42881 10.033C4.78081 10.033 3.13281 12 3.13281 12C3.13281 12 4.78081 13.968 6.42881 13.968C7.36081 13.968 8.30481 13.694 8.93881 13.429"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.811 8.556C14.077 7.922 14.351 6.978 14.351 6.047C14.351 4.399 12.383 2.75 12.383 2.75C12.383 2.75 10.415 4.399 10.415 6.047C10.415 6.97 10.689 7.918 10.955 8.553"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.8271 13.429C16.4611 13.694 17.4051 13.968 18.3371 13.968C19.9851 13.968 21.6331 12 21.6331 12C21.6331 12 19.9851 10.033 18.3371 10.033C17.4131 10.033 16.4621 10.309 15.8281 10.575"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.8271 13.429C16.4631 13.689 17.3321 14.166 17.9841 14.819C19.1501 15.984 18.9241 18.541 18.9241 18.541C18.9241 18.541 17.8081 18.6396 16.7144 18.3706"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.8105 8.55604C14.0715 7.92004 14.5485 7.05204 15.2005 6.39904C16.3665 5.23404 18.9235 5.46004 18.9235 5.46004C18.9235 5.46004 19.0122 6.46246 18.7921 7.49815"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.93786 10.575C8.30086 10.314 7.43986 9.84104 6.78186 9.18204C5.61586 8.01604 5.84186 5.46004 5.84186 5.46004C5.84186 5.46004 6.82985 5.37272 7.85761 5.58644"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.9579 15.4449C10.6969 16.0819 10.2229 16.9429 9.56486 17.6019C8.39886 18.7669 5.84186 18.5409 5.84186 18.5409C5.84186 18.5409 5.74561 17.452 6.00278 16.3716"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default Logo
