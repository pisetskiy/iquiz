package by.pisetskiy.iquiz.model.entity;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Formula;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@SuperBuilder
public class JobPosition extends BaseEntity {

    private String title;

    @Formula("(select count(pq.quiz_id) from job_position_quiz pq where pq.job_position_id = id)")
    private Integer quizzesCount;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "job_position_quiz",
            joinColumns = @JoinColumn(name = "job_position_id"),
            inverseJoinColumns = @JoinColumn(name = "quiz_id"))
    @ToString.Exclude
    @Builder.Default
    private Set<Quiz> quizzes = new HashSet<>();

    public void addQuiz(Quiz quiz) {
        this.quizzes.add(quiz);
        quiz.getPositions().add(this);
    }

    public void removeQuiz(Quiz quiz) {
        this.quizzes.remove(quiz);
        quiz.getPositions().remove(this);
    }
}
