package com.examportal.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examportal.dao.StudentQueryDao;
import com.examportal.dao.UserDao;
import com.examportal.dto.StudentQueryDTO;
import com.examportal.dto.StudentQueryResponseDTO;
import com.examportal.dto.StudentQueryUpdateDTO;
import com.examportal.entities.StudentQuery;
import com.examportal.entities.User;
import com.examportal.exceptions.ResourceNotFoundException;

@Service
@Transactional
public class StudentQueryServiceImpl implements StudentQueryService {

    @Autowired
    private StudentQueryDao studentQueryDao;
    
    @Autowired
    private UserDao userDao;
    
    @Autowired
    private ModelMapper mapper;

    @Override
    public StudentQueryResponseDTO submitQuery(String username, StudentQueryDTO queryDTO) {
        User student = userDao.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        StudentQuery studentQuery = new StudentQuery(student, queryDTO.getTitle(), queryDTO.getSubject(), queryDTO.getQuery());
        StudentQuery savedQuery = studentQueryDao.save(studentQuery);
        return mapper.map(savedQuery, StudentQueryResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentQueryResponseDTO> getQueriesByUser(String username) {
        User student = userDao.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return studentQueryDao.findByStudent(student).stream()
            .map(query -> mapper.map(query, StudentQueryResponseDTO.class))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentQueryResponseDTO> getAllQueries() {
        return studentQueryDao.findAll().stream()
            .map(query -> mapper.map(query, StudentQueryResponseDTO.class))
            .collect(Collectors.toList());
    }

    @Override
    public StudentQueryResponseDTO updateQuery(Long queryId, StudentQueryUpdateDTO updateDTO) {
        StudentQuery query = studentQueryDao.findById(queryId)
            .orElseThrow(() -> new ResourceNotFoundException("Query not found with id: " + queryId));
        
        query.setResponse(updateDTO.getResponse());
        query.setStatus(updateDTO.getStatus());
        query.setRespondedAt(java.time.LocalDateTime.now());
        
        StudentQuery updatedQuery = studentQueryDao.save(query);
        return mapper.map(updatedQuery, StudentQueryResponseDTO.class);
    }

    @Override
    public void deleteQuery(Long queryId) {
        if (!studentQueryDao.existsById(queryId)) {
            throw new ResourceNotFoundException("Query not found with id: " + queryId);
        }
        studentQueryDao.deleteById(queryId);
    }
}
