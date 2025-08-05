using AutoMapper;
using ExamPortal.DTOs;
using ExamPortal.Models;

namespace ExamPortal.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // User mappings
            CreateMap<UserSignupDTO, User>()
                .ForMember(dest => dest.Password, opt => opt.Ignore()) // Password will be hashed separately
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => 
                    src.Role.ToUpper() == "TEACHER" ? UserRole.TEACHER : UserRole.STUDENT));
            
            CreateMap<UserUpdateDTO, User>()
                .ForMember(dest => dest.Password, opt => opt.Ignore()) // Password will be hashed separately
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
            
            CreateMap<User, UserResponseDTO>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));
            
            // Exam mappings
            CreateMap<ExamDTO, Exam>();
            CreateMap<Exam, ExamResponseDTO>()
                .ForMember(dest => dest.QuestionCount, opt => opt.Ignore()); // Will be set separately
            
            // Question mappings
            CreateMap<QuestionDTO, Question>();
            CreateMap<Question, QuestionResponseDTO>();
            
            // Student Query mappings
            CreateMap<StudentQuery, StudentQueryResponseDTO>();
            
            // Answer mappings
            CreateMap<AnswerDTO, Answer>();
        }
    }
}
